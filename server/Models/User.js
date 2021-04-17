const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
  fileId: {
    type: Schema.Types.ObjectId,
  },
});

module.exports = model('User', userSchema);
