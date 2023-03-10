const User = require('../models/user');
const ResourceNotFound = require('../utils/ResourceNotFound');
const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_INTERNAL_SERVER_ERROR,
} = require('../utils/statuses');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(STATUS_OK).send(users))
    .catch(() => res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error finding users' }));
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new ResourceNotFound();
    })
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((e) => {
      if (e.name === 'ResourceNotFound') {
        res.status(e.status).send(e);
      } else if (e.name === 'CastError') {
        res.status(STATUS_BAD_REQUEST).send({ message: e.message });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error finding user' });
      }
    });
};

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(STATUS_CREATED).send(user))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).send({ message: e.message });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error creating user' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new ResourceNotFound();
    })
    .then((user) => res.status(STATUS_OK).send({ data: user }))
    .catch((e) => {
      if (e.name === 'ResourceNotFound') {
        res.status(e.status).send(e);
      } else if (e.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).send({ message: e.message });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error update user' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new ResourceNotFound();
    })
    .then((user) => res.status(STATUS_OK).send({ data: user }))
    .catch((e) => {
      if (e.name === 'ResourceNotFound') {
        res.status(e.status).send(e);
      } else if (e.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).send({ message: e.message });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error update avatar' });
      }
    });
};

module.exports = {
  getUser,
  getUsers,
  createUser,
  updateUser,
  updateAvatar,
};