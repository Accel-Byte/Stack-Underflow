const { model, Schema } = require('mongoose');

const answerSchema = Schema({
  _id: String,
  body: String,
  username: String,
  upvotes: [
    {
      username: String,
      createdAt: String,
    },
  ],
  downvotes: [
    {
      username: String,
      createdAt: String,
    },
  ],
  voteCount: {
    type: Number,
    default: 0,
  },
  createdAt: String,
});

const commentSchema = Schema({
  _id: String,
  body: String,
  username: String,
  createdAt: String,
});

const tagSchema = Schema({
  id: Number,
  name: String,
});

const questionSchema = Schema({
  body: String,
  title: String,
  username: String,
  tags: [tagSchema],
  comments: [commentSchema],
  upvotes: [
    {
      username: String,
      createdAt: String,
    },
  ],
  downvotes: [
    {
      username: String,
      createdAt: String,
    },
  ],
  voteCount: {
    type: Number,
    default: 0,
  },
});

const postSchema = new Schema({
  createdAt: String,
  question: questionSchema,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  answers: [answerSchema],
  featured: { type: Boolean, default: false },
});

module.exports = model('Post', postSchema);
