const User = require('../models/user');
const ValidationError = require('../utils/ValidationError');
const ResourceNotFound = require('../utils/ResourceNotFound');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((e) => res.status(500).send({ message: `Error finding users ${e}` }));
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new ResourceNotFound();
    })
    .then((user) => res.status(200).send(user))
    .catch((e) => {
      if (e.name === 'ResourceNotFound') {
        res.status(e.status).send(e);
      } else if (e.name === 'ValidationError') {
        res.status(e.status).send(e);
      } else {
        res.status(500).send({ message: `Error finding user ${e}` });
      }
    });
};

const createUser = (req, res) => {
  User.create(req.body)
    .orFail(() => {
      throw new ValidationError();
    })
    .then((user) => res.status(201).send(user))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res.status(e.status).send(e);
      } else {
        res.status(500).send({ message: `Error creating user ${e}` });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new ValidationError();
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((e) => {
      if (e.name === 'ResourceNotFound') {
        res.status(e.status).send(e);
      } else if (e.name === 'ValidationError') {
        res.status(e.status).send(e);
      } else {
        res.status(500).send({ message: `Error update user ${e}` });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new ValidationError();
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res.status(e.status).send(e);
      } else {
        res.status(500).send({ message: `Error update avatar ${e}` });
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