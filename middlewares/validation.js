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

const validateItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    weather: Joi.string().required(),
    imageUrl: Joi.string().required().custom(validateURL),
  }),
});