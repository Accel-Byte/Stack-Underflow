const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../Models/Post');
const checkAuth = require('../../utils/check-auth');

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find();
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error('Post not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createPost(_, { body }, context) {
      const user = checkAuth(context);
      if (body.trim() === '') {
        throw new Error('Post body must not be empty');
      }

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();
      context.pubsub.publish('NEW_POST', {
        newPost: post,
      });
      return post;
    },
    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return 'Post deleted successfully';
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async upvotePost(_, { postId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);
      if (post) {
        if (post.upvotes.find((upvote) => upvote.username === username)) {
          // Post already likes, unlike it
          post.upvotes = post.upvotes.filter(
            (upvote) => upvote.username !== username
          );
          post.voteCount -= 1;
        } else {
          // Not liked
          if (
            post.downvotes.find((downvote) => downvote.username === username)
          ) {
            // Post disliked then remove downvote
            post.downvotes = post.downvotes.filter(
              (downvote) => downvote.username !== username
            );
          }
          // upvote post
          post.upvotes.push({
            username,
            createdAt: new Date().toISOString(),
          });
          post.voteCount += 1;
        }

        await post.save();
        return post;
      } else throw new UserInputError('Post not found');
    },

    async downvotePost(_, { postId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);
      if (post) {
        if (post.downvotes.find((downvote) => downvote.username === username)) {
          // Post already disliked
          post.downvotes = post.downvotes.filter(
            (downvote) => downvote.username !== username
          );
          post.voteCount += 1;
        } else {
          // Post not disliked
          if (post.upvotes.find((upvote) => upvote.username === username)) {
            // Post liked then remove upvote
            post.upvotes = post.upvotes.filter(
              (upvote) => upvote.username !== username
            );
          }
          // downvote post
          post.downvotes.push({
            username,
            createdAt: new Date().toISOString(),
          });
          post.voteCount -= 1;
        }

        await post.save();
        return post;
      } else throw new UserInputError('Post not found');
    },
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => {
        return pubsub.asyncIterator('NEW_POST');
      },
    },
  },
};
