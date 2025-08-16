import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useUser } from "../contexts/UserContext";

interface Product {
  _id: string;
  name: string;
  images: string[];
  price: { $numberDecimal: string };
  currency: string;
}

interface ProductCardProps {
  product: Product;
  showAddToBag?: boolean;
  inCart?: boolean;
  addingToCart?: string | null;
  onAddToCart?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showAddToBag = true,
  inCart = false,
  addingToCart = null,
  onAddToCart = () => {},
}) => {
  const navigate = useNavigate();
  const { userData } = useUser();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const price = parseFloat(product.price?.$numberDecimal || "0");

  const formatINR = (val: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: product.currency || "INR",
    }).format(val);

  // Check if product is in wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!userData?._id) return;
      
      try {
        const res = await fetch(`http://casa-backend-uf0h.onrender.com/api/wishlist/${userData._id}`);
        if (res.ok) {
          const wishlist = await res.json();
          const isInList = wishlist.some((item: any) => item.product._id === product._id);
          setIsInWishlist(isInList);
        }
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };

    checkWishlistStatus();
  }, [userData?._id, product._id]);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!userData?.isLoggedIn) {
      // Redirect to profile if not logged in
      navigate("/profile");
      return;
    }

    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch('http://casa-backend-uf0h.onrender.com/api/wishlist/remove', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: userData._id, product: product._id }),
        });

        if (response.ok) {
          setIsInWishlist(false);
          window.dispatchEvent(new CustomEvent('wishlistUpdated'));
        }
      } else {
        // Add to wishlist
        const response = await fetch('http://casa-backend-uf0h.onrender.com/api/wishlist/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: userData._id, product: product._id }),
        });

        if (response.ok) {
          setIsInWishlist(true);
          window.dispatchEvent(new CustomEvent('wishlistUpdated'));
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <article className="rounded-2xl overflow-hidden border border-gray-900 bg-gray-925 focus-within:ring-2 focus-within:ring-blue-600">
      <button
        onClick={() => navigate(`/product/${product._id}`)}
        className="block w-full text-left"
        aria-label={`Open ${product.name}`}
      >
        <div className="relative">
          <div className="aspect-[3/4] bg-gray-900 overflow-hidden">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                No image
              </div>
            )}
          </div>
          <span className="absolute top-2 left-2 text-[10px] font-bold bg-red-500 text-white px-2 py-1 rounded-full">
            TRY 'n BUY
          </span>
          
          {/* Wishlist Heart Button */}
          <button
            onClick={handleWishlistToggle}
            disabled={wishlistLoading}
            className={`absolute top-2 right-2 p-2 rounded-full transition-all ${
              isInWishlist 
                ? 'bg-red-500 text-white' 
                : 'bg-white/20 text-white hover:bg-white/30'
            } ${wishlistLoading ? 'opacity-50' : ''}`}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart 
              size={16} 
              className={isInWishlist ? 'fill-current' : ''} 
            />
          </button>
        </div>
        <div className="p-3">
          <h3 className="text-sm font-semibold line-clamp-2 leading-snug">
            {product.name}
          </h3>
          <p className="mt-2 text-base font-bold">{formatINR(price)}</p>
        </div>
      </button>

      {showAddToBag && (
        <div className="px-3 pb-3">
          <button
            onClick={() => onAddToCart(product._id)}
            disabled={inCart || addingToCart === product._id}
            className={`w-full py-2 rounded-xl text-sm font-semibold active:scale-95 transition disabled:opacity-60 ${
              inCart
                ? "bg-green-600 text-white"
                : addingToCart === product._id
                ? "bg-blue-400 text-white"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            aria-live="polite"
          >
            {inCart
              ? "✓ Added to Bag"
              : addingToCart === product._id
              ? "Adding…"
              : "Add to Bag"}
          </button>
        </div>
      )}
    </article>
  );
};

export default ProductCard;
