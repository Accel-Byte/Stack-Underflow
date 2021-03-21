const User = require("../../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../utils/validator");
const { SECRET_KEY } = require("../../config");

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
}

module.exports = {
  Mutation: {
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      const user = await User.findOne({ username });

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong crendetials";
        throw new UserInputError("Wrong crendetials", { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    async register(
      parent,
      { registerInput: { username, password, confirmPassword, email } },
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
        throw new UserInputError("Errors", {
          errors,
        });
      }

      // TODO: Make Sure User Doesn't Exist
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("Username Taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }

      // TODO: Hash Password and token gen
      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        password,
        username,
        createdAt: new Date().toISOString(),
      });
      const res = await newUser.save();
      const token = generateToken(res);
      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
