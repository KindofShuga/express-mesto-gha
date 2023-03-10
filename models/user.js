const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User {PATH} required'],
    minlength: [2, 'Must be at least 2'],
    maxlength: [30, 'Must be max 30'],
  },
  about: {
    type: String,
    required: [true, 'User {PATH} required'],
    minlength: [2, 'Must be at least 2'],
    maxlength: [30, 'Must be max 30'],
  },
  avatar: {
    type: String,
    required: [true, 'User {PATH} required'],
  },
});

module.exports = mongoose.model('user', userSchema);