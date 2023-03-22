const Card = require('../models/card');
const ResourceNotFound = require('../errors/ResourceNotFound');
const Forbidden = require('../errors/Forbidden');
const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
} = require('../errors/statuses');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(STATUS_OK).send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((user) => res.status(STATUS_CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).send({ message: err.message });
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new ResourceNotFound();
    })
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.deleteOne(card)
          .then(() => res.status(STATUS_OK).send({ data: card }))
          .catch(next);
      } else {
        throw new Forbidden();
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_BAD_REQUEST).send({ message: err.message });
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new ResourceNotFound();
    })
    .then((card) => res.status(STATUS_OK).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_BAD_REQUEST).send({ message: err.message });
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new ResourceNotFound();
    })
    .then((card) => res.status(STATUS_OK).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_BAD_REQUEST).send({ message: err.message });
      } else {
        next(err);
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