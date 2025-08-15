import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share, Search, ShoppingBag, Shield, RotateCcw, Sparkles, ChevronRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface Product {
  _id: string;
  name: string;
  description?: string;
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
  sizes?: string[]; // Assuming products might not always have sizes
  stock: { [key: string]: number }; // Assuming stock is an object with size keys and number values
  specifications?: {
    pattern?: string;
    length?: string;
    fabric?: string;
    sleeveLength?: string;
    fit?: string;
    distress?: string;
    [key: string]: string | undefined; // Allow for other string-based specifications
  };
}

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Specify type for useParams
  const navigate = useNavigate();
  // Removed wishlist context and hooks
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(''); // Changed default to empty
  const [activeTab, setActiveTab] = useState<'SPECIFICATION' | 'DESCRIPTION'>('SPECIFICATION');

  // Swipe state
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);


  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (id: string) => {
    try {
      const response = await fetch(`http://https://casa-backend-uf0h.onrender.com/api/products/id/${id}`);
      const data: Product = await response.json(); // Explicitly type data
      setProduct(data);
      // Set a default selected size if product has sizes and no size is pre-selected
      if (data.sizes && data.sizes.length > 0 && !selectedSize) {
        setSelectedSize(data.sizes[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('Please select a size'); // Using alert for simplicity
      console.error('Please select a size');
      return;
    }
    if (!product) {
      console.error('Product not loaded');
      return;
    }
    console.log('Buy Now clicked for product:', product, { size: selectedSize });
    navigate('/checkout', {
      state: {
        product: {
          id: product._id,
          name: product.name,
          brand: product.brand.name,
          price: typeof product.price === 'object' && product.price !== null && '$numberDecimal' in product.price
          ? product.price.$numberDecimal
          : product.price,
          images: product.images[0],
          selectedSize: selectedSize,
          quantity: 1
        },
        directBuy: true
      }
    });
  };

  const handleAddToBag = async () => {
    if (!selectedSize) {
      alert('Please select a size'); // Using alert for simplicity
      console.error('Please select a size');
      return;
    }

    if (!product) {
      console.error('Product not loaded');
      return;
    }
    try {
      console.log('🛒 Adding to bag:', product.name, { size: selectedSize });
      await addToCart(product._id, 1, selectedSize);
      console.log('✅ Product added to bag successfully');
      navigate('/bag');
    } catch (error) {
      console.error('❌ Error adding to bag:', error);
      alert('Failed to add product to bag. Please try again.');
    }
  };

  // Removed handleFavorite function

  // Swipe handlers (no changes here, they look correct for the logic)
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    setStartX(touch.clientX);
    setIsDragging(true);
    setSwipeOffset(0);
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    const touch = e.touches[0];
    const currentX = touch.clientX;
    const diff = currentX - startX;
    const newOffset = Math.max(-150, Math.min(150, diff));
    setSwipeOffset(newOffset);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    const fullSwipeThreshold = 120;

    if (swipeOffset <= -fullSwipeThreshold) {
      handleBuyNow();
    } else if (swipeOffset >= fullSwipeThreshold) {
      handleAddToBag();
    }

    setSwipeOffset(0);
    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const initialX = e.clientX;
    setStartX(initialX);
    setIsDragging(true);
    setSwipeOffset(0);

    let currentOffset = 0;
    let dragging = true;

    const handleGlobalMouseMove = (event: MouseEvent) => {
      if (!dragging) return;

      const currentX = event.clientX;
      const diff = currentX - initialX;
      const newOffset = Math.max(-150, Math.min(150, diff));
      currentOffset = newOffset;
      setSwipeOffset(newOffset);
    };

    const handleGlobalMouseUp = () => {
      const fullSwipeThreshold = 120;

      if (currentOffset <= -fullSwipeThreshold) {
        handleBuyNow();
      } else if (currentOffset >= fullSwipeThreshold) {
        handleAddToBag();
      }

      setSwipeOffset(0);
      setIsDragging(false);
      dragging = false;

      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (loading) return <div className="min-h-screen bg-gray-900 text-white p-8">Loading...</div>;
  if (!product) return <div className="min-h-screen bg-gray-900 text-white p-8">Product not found.</div>;

  const price = typeof product.price === 'object' && product.price !== null && '$numberDecimal' in product.price
    ? product.price.$numberDecimal
    : product.price;

  return (
    <div className="relative max-w-md mx-auto min-h-screen bg-gray-900 text-white overflow-x-hidden">
      <div className="pb-24">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-900">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <span className="text-sm text-gray-400">Back</span>
          </div>
          <div className="flex items-center space-x-4">
            <Search className="w-6 h-6 text-white" />
            {/* Removed the Heart button for wishlist */}
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Main Product Image */}
        <div className="relative">
          <div className="relative h-96 bg-gradient-to-br from-red-900 to-red-700 rounded-2xl mx-4 overflow-hidden">
            <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm font-bold">
              TRY 'n BUY
            </div>
            <div className="absolute bottom-4 left-4 z-10 flex items-center space-x-2 bg-black bg-opacity-60 text-white px-3 py-2 rounded-full text-sm font-bold">
              <Sparkles className="w-4 h-4" />
              <span>TRY ON</span>
            </div>
            <div className="absolute bottom-4 right-4 z-10 bg-black bg-opacity-60 text-white p-2 rounded-full">
              <Share className="w-5 h-5" />
            </div>
            {/* Removed the Heart button from the main image */}
            <img
              src={product.images[currentImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x600/ef4444/ffffff?text=Image+Failed'; }}
            />
          </div>

          {/* Thumbnail Images */}
          <div className="flex justify-center space-x-2 mt-4 px-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  index === currentImageIndex ? 'border-blue-500' : 'border-gray-600'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = 'https://placehold.co/64x64/374151/ffffff?text=Img'; }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{product.brand.name}</h1>
              <p className="text-gray-400">{product.name}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-white">{product.currency}{price}</span>
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Size</h3>
              <button className="text-white underline text-sm">size chart</button>
            </div>
            <div className="flex space-x-3 mb-2">
              {product.sizes?.map((size) => ( // Use optional chaining for sizes
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  className={`px-4 py-2 border rounded-lg transition-colors ${
                    selectedSize === size
                      ? 'border-white bg-white text-black'
                      : 'border-gray-600 text-white hover:border-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {/* Conditional rendering for stock, ensure product.stock exists and the size exists in stock */}
            {product.stock && selectedSize && product.stock[selectedSize] !== undefined && (
              <p className="text-sm text-red-400">⚡ {product.stock[selectedSize]} left</p>
            )}
          </div>

          {/* Tabs */}
          <div>
            <div className="flex border-b border-gray-700">
              <button
                onClick={() => setActiveTab('SPECIFICATION')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'SPECIFICATION'
                    ? 'border-white text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                SPECIFICATION
              </button>
              <button
                onClick={() => setActiveTab('DESCRIPTION')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'DESCRIPTION'
                    ? 'border-white text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                DESCRIPTION
              </button>
            </div>

            <div className="pt-4">
              {activeTab === 'SPECIFICATION' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  {/* Use optional chaining for specifications */}
                  <div>
                    <p className="text-gray-400">Pattern</p>
                    <p className="text-white font-medium">{product.specifications?.pattern}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Length</p>
                    <p className="text-white font-medium">{product.specifications?.length}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Fabric</p>
                    <p className="text-white font-medium">{product.specifications?.fabric}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Sleeve length</p>
                    <p className="text-white font-medium">{product.specifications?.sleeveLength}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Fit</p>
                    <p className="text-white font-medium">{product.specifications?.fit}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Distress</p>
                    <p className="text-white font-medium">{product.specifications?.distress}</p>
                  </div>
                </div>
              )}
              {activeTab === 'DESCRIPTION' && (
                <p className="text-gray-300">{product.description}</p>
              )}
            </div>

            <button className="text-white text-sm mt-4 flex items-center">
              View more <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 py-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <p className="text-xs text-white font-medium">Secure payment</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <RotateCcw className="w-6 h-6 text-white" />
              </div>
              <p className="text-xs text-white font-medium">7 day return</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <p className="text-xs text-white font-medium">TRY 'n BUY</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar: Swipeable central icon */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800">
        <div className="px-4 py-3">
          <div className="relative flex items-center justify-between bg-gray-800 rounded-xl p-3">
            {/* Left Action - Buy Now */}
            <div className="flex items-center space-x-2 text-white">
              <span className="text-sm font-semibold">BUY NOW</span>
              <div className="flex space-x-1">
                <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
                <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
                <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
              </div>
            </div>

            {/* Central Swipeable T-shirt Icon */}
            <div
              className={`w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 select-none touch-manipulation ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              style={{
                transform: `translateX(${swipeOffset}px) ${isDragging ? 'scale(1.05)' : 'scale(1)'}`,
                transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                willChange: 'transform',
                zIndex: isDragging ? 10 : 1,
                boxShadow: isDragging ? '0 8px 25px rgba(59, 130, 246, 0.4)' : '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 4h1.5c.83 0 1.5.67 1.5 1.5S18.33 7 17.5 7H16v1h4v2h-4v10H8V10H4V8h4V7H6.5C5.67 7 5 6.33 5 5.5S5.67 4 6.5 4H8c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2z"/>
              </svg>
            </div>

            {/* Right Action - Add to Bag */}
            <div className="flex items-center space-x-2 text-white">
              <div className="flex space-x-1">
                <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
                </svg>
                <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
                </svg>
                <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
                </svg>
              </div>
              <span className="text-sm font-semibold">ADD TO BAG</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;