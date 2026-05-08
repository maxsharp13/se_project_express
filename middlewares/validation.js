const { celebrate, Joi } = require("celebrate");
const validator = require("validator");

function validateURL(value, helpers) {
  if (validator.isURL(value)) {
    return value;
  }

  return helpers.error("string.uri");
}

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().custom(validateURL),
  }),
});

const validateCreateItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    weather: Joi.string().required(),
    imageUrl: Joi.string().required().custom(validateURL),
  }),
});

const validateObjectId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24),
    userId: Joi.string().hex().length(24),
  }),
});

module.exports = {
  validateCreateUser,
  validateLogin,
  validateUpdateProfile,
  validateCreateItem,
  validateObjectId,
};