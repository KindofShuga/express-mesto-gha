const router = require('express').Router();
const usersRoutes = require('./users');
const cardsRoutes = require('./cards');
const { STATUS_NOT_FOUND } = require('../utils/statuses');

router.use('/users', usersRoutes);
router.use('/cards', cardsRoutes);
router.use('*', (req, res) => {
  res.status(STATUS_NOT_FOUND).send({ message: 'Resource Not Found' });
});

module.exports = router;