const User = require('../models/user');
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../utils/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      res.status(SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error('User ID not found');
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);

      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Invalid user id' });
      }

      if (err.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).send({ message: 'User not found' });
      }

      return res.status(SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);

      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Invalid data passed to create user.' });
      }

      return res.status(SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
    });
};