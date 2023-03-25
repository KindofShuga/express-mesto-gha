const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const usersRoutes = require('./users');
const cardsRoutes = require('./cards');
const ResourceNotFound = require('../errors/ResourceNotFound');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
router.use('/users', auth, usersRoutes);
router.use('/cards', auth, cardsRoutes);
router.use('*', (req, res, next) => {
  next(new ResourceNotFound());
});

module.exports = router;