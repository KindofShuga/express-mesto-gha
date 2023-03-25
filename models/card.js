const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Card {PATH} required'],
    minlength: [2, 'Must be at least 2'],
    maxlength: [30, 'Must be max 30'],
  },
  link: {
    type: String,
    required: [true, 'Card {PATH} required'],
    validate: {
      validator: (v) => isURL(v),
      message: 'link is not valid',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Card {PATH} required'],
    ref: 'user',
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
    ref: 'user',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);