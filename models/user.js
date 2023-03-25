const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const UnauthorizedError = require('../errors/UnauthorizedError');

mongoose.set('strictQuery', false);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Must be at least 2'],
    maxlength: [30, 'Must be max 30'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Must be at least 2'],
    maxlength: [30, 'Must be max 30'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        return /https?:\/\/(\w{3}\.)?[1-9a-z\-.]{1,}\w\w(\/[1-90a-z.,_@%&?+=~/-]{1,}\/?)?#?/i.test(v);
      },
      message: 'avatar is not valid',
    },
  },
  email: {
    type: String,
    required: [true, 'User {PATH} required'],
    unique: [true, 'User {PATH} already exists'],
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'email is not valid',
    },
  },
  password: {
    type: String,
    required: [true, 'User {PATH} required'],
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError();
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError();
          }
          return user;
        });
    });
};

userSchema.set('toJSON', {
  transform(doc, ret) {
    // eslint-disable-next-line no-param-reassign
    delete ret.password;
    return ret;
  },
});

module.exports = mongoose.model('user', userSchema);