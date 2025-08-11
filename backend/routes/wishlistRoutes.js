const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');

router.post('/add', wishlistController.addToWishlist);
router.get('/:userId', wishlistController.getWishlistByUser);
router.delete('/remove', wishlistController.removeFromWishlist);

module.exports = router;
