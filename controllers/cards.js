const Card = require('../models/card');
const ResourceNotFound = require('../utils/ResourceNotFound');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((e) => res.status(500).send({ message: `Error finding cards ${e}` }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((user) => res.status(201).send(user))
    .catch((e) => res.status(500).send({ message: `Error creating card ${e}` }));
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new ResourceNotFound();
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((e) => {
      if (e.name === 'ResourceNotFound') {
        res.status(e.status).send(e);
      } else {
        res.status(500).send({ message: `Error deleting card ${e}` });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new ResourceNotFound();
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((e) => {
      if (e.name === 'ResourceNotFound') {
        res.status(e.status).send(e);
      } else {
        res.status(500).send({ message: `Error like card ${e}` });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new ResourceNotFound();
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((e) => {
      if (e.name === 'ResourceNotFound') {
        res.status(e.status).send(e);
      } else {
        res.status(500).send({ message: `Error dislike card ${e}` });
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