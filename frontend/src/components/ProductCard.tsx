import React from "react";
import { useNavigate } from "react-router-dom";

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
  const price = parseFloat(product.price?.$numberDecimal || "0");

  const formatINR = (val: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: product.currency || "INR",
    }).format(val);

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
