const Card = require('../models/card');
const ResourceNotFound = require('../utils/ResourceNotFound');
const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_INTERNAL_SERVER_ERROR,
} = require('../utils/statuses');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(STATUS_OK).send(cards))
    .catch(() => res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error finding cards' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((user) => res.status(STATUS_CREATED).send(user))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).send({ message: e.message });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error creating card' });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new ResourceNotFound();
    })
    .then((card) => res.status(STATUS_OK).send({ data: card }))
    .catch((e) => {
      if (e.name === 'ResourceNotFound') {
        res.status(e.status).send(e);
      } else if (e.name === 'CastError') {
        res.status(STATUS_BAD_REQUEST).send({ message: e.message });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error deleting card' });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new ResourceNotFound();
    })
    .then((card) => res.status(STATUS_OK).send({ data: card }))
    .catch((e) => {
      if (e.name === 'ResourceNotFound') {
        res.status(e.status).send(e);
      } else if (e.name === 'CastError') {
        res.status(STATUS_BAD_REQUEST).send({ message: e.message });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error like card' });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new ResourceNotFound();
    })
    .then((card) => res.status(STATUS_OK).send({ data: card }))
    .catch((e) => {
      if (e.name === 'ResourceNotFound') {
        res.status(e.status).send(e);
      } else if (e.name === 'CastError') {
        res.status(STATUS_BAD_REQUEST).send({ message: e.message });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error dislike card' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};