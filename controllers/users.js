const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { JWT_SECRET } = require('../utils/config');

const {
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
} = require('../utils/errors');


module.exports.createUser = (req, res) => {
  const {
    name, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;

      res.status(201).send(userObj);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(CONFLICT).send({
          message: 'Email already exists',
        });
      }

      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Invalid user data',
        });
      }

      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'An error has occurred on the server',
      });
    });
};


module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch((err) => {
      if (err.message === 'Incorrect email or password') {
        return res.status(UNAUTHORIZED).send({
          message: 'Incorrect email or password',
        });
      }

      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'An error has occurred on the server',
      });
    });
};


module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({
          message: 'User not found',
        });
      }

      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Invalid user id',
        });
      }

      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'An error has occurred on the server',
      });
    });
};


module.exports.updateProfile = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Invalid data',
        });
      }

      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({
          message: 'User not found',
        });
      }

      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Invalid user id',
        });
      }

      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'An error has occurred on the server',
      });
    });
};