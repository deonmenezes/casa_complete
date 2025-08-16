import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number | { $numberDecimal: string };
  currency: string;
  images: string[];
  brand: {
    _id: string;
    name: string;
    logo_url?: string;
  };
  category: {
    _id: string;
    name: string;
  };
  tags: string[];
  gender: string;
}

const ProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const brandId = searchParams.get('brand');

  useEffect(() => {
    if (categoryId) {
      fetchProductsByCategory(categoryId);
    } else if (brandId) {
      fetchProductsByBrand(brandId);
    } else {
      setLoading(false);
    }
  }, [categoryId, brandId]);

  const fetchProductsByCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`https://casa-backend-uf0h.onrender.com/api/products/category?category=${categoryId}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByBrand = async (brandId: string) => {
    try {
      const response = await fetch(`https://casa-backend-uf0h.onrender.com/api/products/brand?id=${brandId}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="sticky top-0 bg-gray-900 z-10 p-4 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Products</h1>
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found for this category.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <img
                  src={product.images[0] || 'https://via.placeholder.com/200'}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-3">
                  <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                  <p className="text-xs text-gray-400 mb-2">{product.brand.name}</p>
                  <p className="font-bold">
                  {product.currency}
{typeof product.price === 'object'
  ? Number(product.price.$numberDecimal).toFixed(2)
  : Number(product.price).toFixed(2)}
</p>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
