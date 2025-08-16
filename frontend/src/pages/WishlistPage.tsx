// src/pages/WishlistPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import ProductCard from '../components/ProductCard';

const WishlistPage: React.FC = () => {
  const { userData } = useUser();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userData?._id) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5002/api/wishlist/${userData._id}`);
        setWishlist(res.data);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [userData?._id]);

  if (loading) return <div className="text-white p-4">Loading Wishlist...</div>;

  return (
    <div className="p-4 text-white">
      <h1 className="text-xl font-bold mb-4">Your Wishlist</h1>
      <div className="grid grid-cols-2 gap-4">
        {wishlist.length > 0 ? (
          wishlist.map((item: any) => (
            <ProductCard key={item.product._id} product={item.product} />
          ))
        ) : (
          <p>No items in wishlist.</p>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
