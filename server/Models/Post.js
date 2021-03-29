const { model, Schema } = require('mongoose');

const postSchema = new Schema({
  createdAt: String,
  question: {
    body: String,
    title: String,
    username: String,
    comments: [
      {
        body: String,
        username: String,
        createdAt: String,
      },
    ],
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
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  answers: [
    {
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
    },
  ],
});

module.exports = model('Post', postSchema);
