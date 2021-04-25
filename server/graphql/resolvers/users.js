const User = require('../../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError, RenameRootFields } = require('apollo-server');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const { GraphQLUpload } = require('graphql-upload');
const ObjectID = require('mongodb').ObjectID;
const fs = require('fs');

const {
  validateRegisterInput,
  validateLoginInput,
} = require('../../utils/validator');
const { SECRET_KEY } = require('../../config');

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      fileId: user.fileId,
    },
    SECRET_KEY,
    { expiresIn: '1d' }
  );
}
const storeFile = async (upload) => {
  const { filename, mimetype, encoding, createReadStream } = await upload.file;

  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'files',
  });

  const uploadStream = bucket.openUploadStream(filename, {
    contentType: mimetype,
  });
  return new Promise((resolve, reject) => {
    createReadStream()
      .pipe(uploadStream)
      .on('error', reject)
      .on('finish', () => {
        resolve(uploadStream.id);
      });
  });
};

const downloadFile = async (fileId) => {
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'files',
  });
  return new Promise((resolve, reject) => {
    // temporary variable to hold image
    var data = [];

    // create the download stream
    const readstream = bucket.openDownloadStream(new ObjectID(fileId));
    readstream.on('data', function (chunk) {
      data.push(chunk);
    });
    readstream.on('error', async (error) => {
      reject(error);
    });
    readstream.on('end', async () => {
      let bufferBase64 = Buffer.concat(data);
      const img = bufferBase64.toString('base64');
      resolve(img);
    });
  });
};

const removeFile = (fileId) => {
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'files',
  });
  return new Promise((resolve, reject) => {
    // temporary variable to hold image
    try {
      bucket.delete(new ObjectID(fileId));
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  Upload: GraphQLUpload,
  Query: {
    async getImage(_, { fileId }) {
      try {
        const img = await downloadFile(fileId);
        return img;
      } catch (error) {
        throw new Error(error);
      }
      // bucket.find({ _id: new ObjectID(fileId) }).toArray((err, files) => {
      //   if (err) {
      //     console.log(err);
      //   } else if (!files || !files[0]) {
      //     throw new Error('File Not Found');
      //   } else {
      //     // Check if is image
      //     if (
      //       files[0].contentType === 'image/jpeg' ||
      //       files[0].contentType === 'image/png'
      //     ) {

      //     } else {
      //       throw new Error('Not an Image');
      //     }
      //   }
      // });
    },
    async getUser(_, { userId }) {
      try {
        const user = await User.findById(userId);
        if (user) {
          return user;
        } else {
          throw new Error('User not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }
      const user = await User.findOne({ username });

      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = 'Wrong crendetials';
        throw new UserInputError('Wrong crendetials', { errors });
      }

      const token = generateToken(user);
      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    async register(
      _,
      { registerInput: { username, password, confirmPassword, email, file } },
      context,
      info
    ) {
      // TODO: Validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError('Errors', {
          errors,
        });
      }

      // TODO: Make Sure User Doesn't Exist
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError('Username Taken', {
          errors: {
            username: 'This username is taken',
          },
        });
      }
      try {
        const fileId = await storeFile(file);

        // TODO: Hash Password and token gen
        password = await bcrypt.hash(password, 12);
        const newUser = new User({
          email,
          password,
          username,
          fileId,
          createdAt: new Date().toISOString(),
        });
        const res = await newUser.save();
        const token = generateToken(res);
        return {
          ...res._doc,
          id: res._id,
          token,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    async updateImage(_, { userId, fileId, file }, context, info) {
      try {
        // Todo: Remove file
        console.log(typeof fileId);
        console.log(typeof userId); 
        await removeFile(fileId);

        // Todo: Update User
        const newfileId = await storeFile(file);
        const user = await User.findOneAndUpdate(
          { _id: userId },
          { $set: { fileId: newfileId } },
          { new: true }
        );
        return user;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
