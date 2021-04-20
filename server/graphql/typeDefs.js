const gql = require('graphql-tag');

module.exports = gql`
  scalar Upload
  type Comment {
    id: ID!
    username: String!
    createdAt: String!
    body: String!
  }
  type Vote {
    id: ID!
    username: String!
    createdAt: String!
  }
  type Question {
    title: String!
    username: String!
    body: String!
    comments: [Comment]!
    upvotes: [Vote]!
    downvotes: [Vote]!
    voteCount: Int!
    commentCount: Int!
  }
  type Answer {
    id: ID!
    body: String!
    username: String!
    upvotes: [Vote]!
    downvotes: [Vote]!
    voteCount: Int!
    createdAt: String!
  }
  type Post {
    id: ID!
    createdAt: String!
    question: Question!
    answers: [Answer]!
    user: ID!
  }
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
    fileId: ID!
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
    file: Upload!
  }
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
    getUser(userId: ID!): User
    getUserPost(userId: ID!): [Post]
    getImage(fileId: ID!): String
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(title: String!, body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    createAnswer(postId: ID!, body: String!): Post!
    deleteAnswer(postId: ID!, answerId: ID!): Post!
    upvotePost(postId: ID!): Post!
    downvotePost(postId: ID!): Post!
    upvoteAnswer(postId: ID!, answerId: ID!): Post!
    downvoteAnswer(postId: ID!, answerId: ID!): Post!
  }
  type Subscription {
    newPost: Post!
    newComment: Comment!
    newAnswer: Answer!
  }
`;
