const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const UnauthorizedError = require('../errors/UnauthorizedError');

mongoose.set('strictQuery', false);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User {PATH} required'],
    minlength: [2, 'Must be at least 2'],
    maxlength: [30, 'Must be max 30'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: [true, 'User {PATH} required'],
    minlength: [2, 'Must be at least 2'],
    maxlength: [30, 'Must be max 30'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: [true, 'User {PATH} required'],
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: [true, 'User {PATH} required'],
    unique: [true, 'User {PATH} already exists'],
    minlength: [2, 'Must be at least 2'],
    maxlength: [30, 'Must be max 30'],
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

module.exports = mongoose.model('user', userSchema);