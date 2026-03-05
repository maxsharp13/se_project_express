const ClothingItem = require('../models/clothingItem');
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../utils/errors');

module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      res.status(SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
    });
};

module.exports.createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: req.user._id,
  })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);

      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Invalid data passed to create item.' });
      }

      return res.status(SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
    });
};

module.exports.deleteClothingItem = (req, res) => {
  ClothingItem.findById(req.params.itemId)
    .orFail(() => {
      const error = new Error('Item ID not found');
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => ClothingItem.findByIdAndDelete(item._id))
    .then((deletedItem) => res.send(deletedItem))
    .catch((err) => {
      console.error(err);

      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Invalid item id' });
      }

      if (err.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).send({ message: 'Item not found' });
      }

      return res.status(SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
    });
};

module.exports.likeItem = (req, res) => ClothingItem.findByIdAndUpdate(
  req.params.itemId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => {
    const error = new Error('Item ID not found');
    error.statusCode = NOT_FOUND;
    throw error;
  })
  .then((item) => res.send(item))
  .catch((err) => {
    console.error(err);

    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Invalid item id' });
    }

    if (err.statusCode === NOT_FOUND) {
      return res.status(NOT_FOUND).send({ message: 'Item not found' });
    }

    return res.status(SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
  });

module.exports.dislikeItem = (req, res) => ClothingItem.findByIdAndUpdate(
  req.params.itemId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => {
    const error = new Error('Item ID not found');
    error.statusCode = NOT_FOUND;
    throw error;
  })
  .then((item) => res.send(item))
  .catch((err) => {
    console.error(err);

    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Invalid item id' });
    }

    if (err.statusCode === NOT_FOUND) {
      return res.status(NOT_FOUND).send({ message: 'Item not found' });
    }

    return res.status(SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
  });