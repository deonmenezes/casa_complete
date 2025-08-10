import React, { useState } from "react";
import { useLocation } from "react-router-dom";

interface ProductsProp {
  data?: Product[];
}

interface Product {
  _id: string;
  name: string;
  description?: string;
  images: string[];
  price: { $numberDecimal: string };
  currency: string;
  sizes: string[];
  fits: string[];
  tags: string[];
  stock: number;
  gender?: string;
  brand: string;
  category: string[];
  created_at: string;
  updated_at: string;
}

const ProductList: React.FC<ProductsProp> = (props) => {
  const location = useLocation();
  const data = props.data || location.state;
  const [products] = useState<Product[]>(data || []);

  return data && data.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {products.map((product) => (
        <div
          key={product._id}
          className="border rounded-lg shadow-md p-4 bg-white"
        >
          {product.images[0] && (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-48 object-cover rounded"
            />
          )}
          <h2 className="text-lg font-semibold mt-2 text-black">
            {product.name}
          </h2>
          <p className="text-sm text-gray-500">
            ₹{product.price.$numberDecimal} {product.currency}
          </p>
        </div>
      ))}
    </div>
  ) : (
    <h1 className="text-center text-lg mt-8">No products found.</h1>
  );
};

export default ProductList;
