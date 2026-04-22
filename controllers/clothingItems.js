const ClothingItem = require('../models/clothingItem');

const {
  BAD_REQUEST,
  NOT_FOUND,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
} = require('../utils/errors');


module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.send(items);
    })
    .catch((err) => {
      console.error('🔥 getClothingItems error:', err); // <-- KEY LINE
      res.status(INTERNAL_SERVER_ERROR).send({
        message: 'An error has occurred on the server',
      });
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
      console.error('🔥 createClothingItem error:', err);

      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Invalid data',
        });
      }

      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'An error has occurred on the server',
      });
    });
};


module.exports.deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        return res.status(FORBIDDEN).send({
          message: 'You are not allowed to delete this item',
        });
      }

      return ClothingItem.findByIdAndDelete(itemId)
        .then((deletedItem) => res.send(deletedItem));
    })
    .catch((err) => {
      console.error('🔥 deleteClothingItem error:', err);

      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({
          message: 'Item not found',
        });
      }

      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Invalid item id',
        });
      }

      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'An error has occurred on the server',
      });
    });
};


module.exports.likeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error('🔥 likeItem error:', err);

      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({
          message: 'Item not found',
        });
      }

      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Invalid item id',
        });
      }

      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'An error has occurred on the server',
      });
    });
};

// 🔥 DISLIKE ITEM
module.exports.dislikeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error('🔥 dislikeItem error:', err);

      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({
          message: 'Item not found',
        });
      }

      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Invalid item id',
        });
      }

      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'An error has occurred on the server',
      });
    });
};