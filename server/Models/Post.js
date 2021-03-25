const { model, Schema } = require("mongoose");

const postSchema = new Schema({
  body: String,
  username: String,
  createdAt: String,
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
    type:Number,
    default:0
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = model("Post", postSchema);
