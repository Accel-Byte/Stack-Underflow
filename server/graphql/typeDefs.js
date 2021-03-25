const gql = require("graphql-tag");

module.exports = gql`
  type Post {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
    comments: [Comment]!
    upvotes: [Vote]!
    downvotes: [Vote]!
    voteCount: Int!
    commentCount: Int!
  }
  type Comment{
    id: ID!
    username: String!
    createdAt: String!
    body: String!
  }
  type Vote{
    id: ID!
    username: String!
    createdAt: String!
  }
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    upvotePost(postId: ID!): Post!
    downvotePost(postId: ID!): Post!
  }
  type Subscription {
    newPost: Post!
  }
`;
