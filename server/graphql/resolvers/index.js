const postResolvers = require("./posts");
const userResolvers = require("./users");
const commentResolvers = require("./comment");

module.exports = {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length
  },
  Query: {
    ...postResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentResolvers.Mutation,
  },
  Subscription: {
    ...postResolvers.Subscription,
  },
};
