const postResolvers = require("./posts");
const userResolvers = require("./users");
const commentResolvers = require("./comment");
const answerResolvers = require("./answer");

module.exports = {
  Question: {
    commentCount: (parent) => parent.comments.length
  },
  Query: {
    ...postResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentResolvers.Mutation,
    ...answerResolvers.Mutation,
  },
  Subscription: {
    ...postResolvers.Subscription,
  },
};
