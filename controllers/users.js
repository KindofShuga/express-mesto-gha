const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ResourceNotFound = require('../errors/ResourceNotFound');
const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_INTERNAL_SERVER_ERROR,
  STATUS_CONFLICTED,
} = require('../errors/statuses');
const { JWT_SECRET } = require('../config');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(STATUS_OK).send(users))
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new ResourceNotFound();
    })
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_BAD_REQUEST).send({ message: err.message });
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => {
      throw new ResourceNotFound();
    })
    .then((user) => res.status(STATUS_OK).send(user))
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, email, password, about, avatar } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash, about, avatar }))
    .then((user) => res.status(STATUS_CREATED).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).send({ message: err.message });
      } else if (err.code === 11000) {
        res.status(STATUS_CONFLICTED).send({ message: 'User already exists' });
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new ResourceNotFound();
    })
    .then((user) => res.status(STATUS_OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).send({ message: err.message });
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new ResourceNotFound();
    })
    .then((user) => res.status(STATUS_OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).send({ message: err.message });
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.status(STATUS_OK).send({ user, token });
    })
    .catch(next);
};

module.exports = {
  getUser,
  getUsers,
  getCurrentUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
};