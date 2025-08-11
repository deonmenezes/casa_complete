const Wishlist = require('../models/wishlist.js');
const Product = require('../models/product');

// ✅ Add to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { user, product } = req.body;
    console.log("💾 Wishlist Request Body:", req.body);

    // Check if already exists
    const exists = await Wishlist.findOne({ user, product });
    if (exists) {
      return res.status(400).json({ message: 'Already in wishlist' });
    }

    const wishlistItem = new Wishlist({ user, product });
    await wishlistItem.save();

    res.status(201).json({ message: 'Added to wishlist', item: wishlistItem });
  } catch (error) {
    console.error("❌ Wishlist Add Error:", error);
    res.status(500).json({ message: 'Failed to add to wishlist', error: error.message });
  }
};

// ✅ Get wishlist by user ID
exports.getWishlistByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const wishlist = await Wishlist.find({ user: userId }).populate('product');
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch wishlist', error: error.message });
  }
};

// ✅ Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { user, product } = req.body;

    const removed = await Wishlist.findOneAndDelete({ user, product });
    if (!removed) return res.status(404).json({ message: 'Item not in wishlist' });

    res.status(200).json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove item', error: error.message });
  }
};
