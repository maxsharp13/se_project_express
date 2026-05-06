const router = require('express').Router();

const {
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require('../controllers/clothingItems');

const {
  validateObjectId,
  validateCreateItem,
} = require('../middlewares/validation');

router.post('/', validateCreateItem, createClothingItem);
router.delete('/:itemId', validateObjectId, deleteClothingItem);

router.put('/:itemId/likes', validateObjectId, likeItem);
router.delete('/:itemId/likes', validateObjectId, dislikeItem);

module.exports = router;