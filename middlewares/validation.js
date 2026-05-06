const { celebrate, Joi } = require('celebrate');

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const validateObjectId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().pattern(objectIdPattern).required(),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().uri().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().uri().required(),
  }),
});

const validateCreateItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    imageUrl: Joi.string().uri().required(),
    weather: Joi.string().valid('hot', 'warm', 'cold').required(),
  }),
});

module.exports = {
  validateObjectId,
  validateCreateUser,
  validateLogin,
  validateUpdateProfile,
  validateCreateItem,
};