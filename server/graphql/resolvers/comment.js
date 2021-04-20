const { UserInputError, AuthenticationError } = require('apollo-server');
const Post = require('../../Models/Post');
const checkAuth = require('../../utils/check-auth');
const mongoose = require('mongoose');

module.exports = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const { username } = checkAuth(context);
      if (body.trim() === '') {
        throw new UserInputError('Empty comment', {
          errors: {
            body: 'Comment body must not empty',
          },
        });
      }

      const post = await Post.findById(postId);
      const newComment = {
        _id: mongoose.Types.ObjectId().toHexString(),
        body,
        username,
        createdAt: new Date().toISOString(),
      };
      if (post) {
        post.question.comments.unshift(newComment);
        await post.save();
        context.pubsub.publish('NEW_COMMENT', {
          newComment,
        });
        return post;
      } else throw new UserInputError('Post not found');
    },
    async deleteComment(_, { postId, commentId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);

      if (post) {
        const commentIndex = post.question.comments.findIndex(
          (c) => c.id === commentId
        );

        if (post.question.comments[commentIndex].username === username) {
          post.question.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } else {
        throw new UserInputError('Post not found');
      }
    },
  },
  Subscription: {
    newComment: {
      subscribe: (_, __, { pubsub }) => {
        return pubsub.asyncIterator('NEW_COMMENT');
      },
    },
  },
};
