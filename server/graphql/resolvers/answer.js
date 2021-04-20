const { UserInputError, AuthenticationError } = require('apollo-server');
const Post = require('../../Models/Post');
const checkAuth = require('../../utils/check-auth');
const mongoose = require('mongoose');

module.exports = {
  Mutation: {
    createAnswer: async (_, { postId, body }, context) => {
      const { username } = checkAuth(context);
      if (body.trim() === '') {
        throw new UserInputError('Empty Answer', {
          errors: {
            body: 'Answer body must not empty',
          },
        });
      }

      const post = await Post.findById(postId);
      const newAnswer = {
        id: mongoose.Types.ObjectId().toHexString(),
        body,
        username,
        upvotes:[],
        downvotes:[],
        voteCount:0,
        createdAt: new Date().toISOString(),
      };
      if (post) {
        post.answers.unshift(newAnswer);
        await post.save();
        context.pubsub.publish('NEW_ANSWER', {
          newAnswer,
        });
        return post;
      } else throw new UserInputError('Post not found');
    },
    async deleteAnswer(_, { postId, answerId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);

      if (post) {
        const answerIndex = post.answers.findIndex(
          (answer) => answer.id === answerId
        );

        if (post.answers[answerIndex].username === username) {
          post.answers.splice(answerIndex, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } else {
        throw new UserInputError('Post not found');
      }
    },

    async upvoteAnswer(_, { postId, answerId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);
      if (post) {
        const answerIndex = post.answers.findIndex(
          (answer) => answer.id === answerId
        );
        if (answerIndex !== -1) {
          if (
            post.answers[answerIndex].upvotes.find(
              (upvote) => upvote.username === username
            )
          ) {
            // Post already likes, unlike it
            post.answers[answerIndex].upvotes = post.answers[
              answerIndex
            ].upvotes.filter((upvote) => upvote.username !== username);
            post.answers[answerIndex].voteCount -= 1;
          } else {
            // Not liked
            if (
              post.answers[answerIndex].downvotes.find(
                (downvote) => downvote.username === username
              )
            ) {
              // Post disliked then remove downvote
              post.answers[answerIndex].downvotes = post.answers[
                answerIndex
              ].downvotes.filter((downvote) => downvote.username !== username);
            }
            // upvote post
            post.answers[answerIndex].upvotes.push({
              username,
              createdAt: new Date().toISOString(),
            });
          }
        } else {
          throw new UserInputError('Answer not found');
        }

        post.answers[answerIndex].voteCount =
          post.answers[answerIndex].upvotes.length -
          post.answers[answerIndex].downvotes.length;
        await post.save();
        return post;
      } else throw new UserInputError('Post not found');
    },

    async downvoteAnswer(_, { postId, answerId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);
      if (post) {
        const answerIndex = post.answers.findIndex(
          (answer) => answer.id === answerId
        );
        if (answerIndex !== -1) {
          if (
            post.answers[answerIndex].downvotes.find(
              (downvote) => downvote.username === username
            )
          ) {
            // Post already disliked
            post.answers[answerIndex].downvotes = post.answers[
              answerIndex
            ].downvotes.filter((downvote) => downvote.username !== username);
          } else {
            // Post not disliked
            if (
              post.answers[answerIndex].upvotes.find(
                (upvote) => upvote.username === username
              )
            ) {
              // Post liked then remove upvote
              post.answers[answerIndex].upvotes = post.answers[
                answerIndex
              ].upvotes.filter((upvote) => upvote.username !== username);
            }
            // downvote post
            post.answers[answerIndex].downvotes.push({
              username,
              createdAt: new Date().toISOString(),
            });
          }
        } else {
          throw new UserInputError('Answer not found');
        }

        post.answers[answerIndex].voteCount =
          post.answers[answerIndex].upvotes.length -
          post.answers[answerIndex].downvotes.length;
        await post.save();
        return post;
      } else throw new UserInputError('Post not found');
    },
  },
  Subscription: {
    newAnswer: {
      subscribe: (_, __, { pubsub }) => {
        return pubsub.asyncIterator('NEW_ANSWER');
      },
    },
  },
};
