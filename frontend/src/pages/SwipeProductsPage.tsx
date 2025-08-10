import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, AnimatePresence, animate } from 'framer-motion';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import fetchProducts from '../utils/fetchProductforSwipe';

// Product interface to match backend data
interface Product {
  _id: string;
  name: string;
  description?: string;
  images: string[];
  price: {
    $numberDecimal: string;
  };
  currency: string;
  tags: string[];
  // Adding exitDirection for framer-motion exit animation
  exitDirection?: 'left' | 'right';
}

// Define props interface for SwipeableCard
interface SwipeableCardProps {
  product: Product;
  onSwipe: (productId: string, direction: 'left' | 'right') => void;
  index: number;
  total: number;
}

// Single Swipeable Card Component using Framer Motion
function SwipeableCard({ product, onSwipe, index, total }: SwipeableCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-20, 20]);
  const scale = useTransform(x, [-300, 0, 300], [0.9, 1, 0.9]);

  const handleDragEnd = (_event: any, info: any) => {
    const offsetX = info.offset.x;
    const velocityX = info.velocity.x;

    if (offsetX > 150 || velocityX > 500) {
      onSwipe(product._id, 'right');
    } else if (offsetX < -150 || velocityX < -500) {
      onSwipe(product._id, 'left');
    } else {
      // Animate back to center with a tween animation for a direct feel
      animate(x, 0, { type: "tween", duration: 0.2 });
    }
  };

  return (
    <motion.div
      className="absolute w-full h-full will-change-transform flex items-center justify-center"
      style={{ zIndex: total - index }}
      initial={{ scale: 0.95, y: 20, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{
        x: product.exitDirection === 'right' ? 500 : -500,
        scale: 0.8,
        transition: { duration: 0.35 }
      }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <motion.div
        className="bg-zinc-800 w-full h-full max-w-[300px] sm:max-w-full max-h-[670px] will-change-transform rounded-2xl touch-none select-none cursor-grab"
        style={{ x, rotate, scale }}
        drag="x"
        onDragEnd={handleDragEnd}
        whileTap={{ cursor: 'grabbing' }}
      >
        <div className="relative w-full h-full rounded-2xl overflow-hidden">
           {/* Swipe action indicators */}
           <motion.div
             className="absolute top-10 left-4 flex items-center justify-center text-red-500 font-bold text-3xl border-4 border-red-500 rounded-xl transform -rotate-12 px-6 py-2"
             style={{ opacity: useTransform(x, [-100, -50], [1, 0]) }}
           >
             SKIP
           </motion.div>
           <motion.div
             className="absolute top-10 right-4 flex items-center justify-center text-green-500 font-bold text-3xl border-4 border-green-500 rounded-xl transform rotate-12 px-6 py-2"
             style={{ opacity: useTransform(x, [50, 100], [0, 1]) }}
           >
             BAG
           </motion.div>

          <img
            src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/400x600/27272a/ffffff?text=No+Image'}
            className="w-full h-full object-cover select-none pointer-events-none"
            alt={product.name}
            draggable={false}
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x600/27272a/ffffff?text=No+Image' }}
          />

          <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 text-white select-none pointer-events-none">
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl font-bold">
                ₹{product.price?.$numberDecimal
                  ? parseFloat(product.price.$numberDecimal).toLocaleString('en-IN')
                  : 'N/A'}
              </p>
              <p className="text-sm text-zinc-300">{product.currency || 'INR'}</p>
            </div>
            <p className="text-lg font-bold mt-1">{product.name || 'Product Name'}</p>
            {product.description && (
              <p className="text-sm text-zinc-200 truncate">{product.description}</p>
            )}
            <div className="flex flex-wrap gap-1 mt-2">
              {product.tags?.slice(0, 3).map((tag: string, tagIndex: number) => (
                <span key={tagIndex} className="text-xs bg-white/20 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}


function Deck() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // State for products, loading, and pagination
  const [cards, setCards] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [seenProductIds, setSeenProductIds] = useState<Set<string>>(new Set());
  
  // Ref to store the size of the current batch for progress bar calculation
  const currentBatchSize = useRef(0);

  const PRODUCTS_PER_BATCH = 10;

  // Function to load the next batch of products
  const loadMoreProducts = async () => {
    if (loadingMore || !hasMoreProducts) return;

    setLoadingMore(true);
    console.log(`🔄 Loading next batch - Page ${currentPage + 1}`);

    const excludeIds = Array.from(seenProductIds);
    const newProducts = await fetchProducts(currentPage + 1, PRODUCTS_PER_BATCH, excludeIds);

    if (newProducts.length === 0) {
      setHasMoreProducts(false);
      console.log('🎉 No more unseen products available!');
    } else {
      const newProductIds = newProducts.map(product => product._id);
      setSeenProductIds(prev => new Set([...prev, ...newProductIds]));
      
      // Set new batch of cards
      setCards(newProducts);
      currentBatchSize.current = newProducts.length; // Update batch size
      setCurrentPage(prev => prev + 1);
      console.log(`✅ Loaded new batch: ${newProducts.length} unique products`);
    }

    setLoadingMore(false);
  };

  // Initial product load
  useEffect(() => {
    const loadInitialProducts = async () => {
      setLoading(true);
      console.log('🚀 Loading initial products...');
      const initialProducts = await fetchProducts(1, PRODUCTS_PER_BATCH, []);
      
      if (initialProducts.length > 0) {
        const initialProductIds = initialProducts.map(product => product._id);
        setSeenProductIds(new Set(initialProductIds));
        currentBatchSize.current = initialProducts.length;
      }
      
      setCards(initialProducts);
      setCurrentPage(1);
      setHasMoreProducts(initialProducts.length === PRODUCTS_PER_BATCH);
      setLoading(false);
    };

    loadInitialProducts();
  }, []);

  // Effect to load more products when the current batch is finished
  useEffect(() => {
    // Trigger when cards array is empty, but it's not the initial load
    if (!loading && cards.length === 0 && hasMoreProducts && !loadingMore) {
      console.log('🔄 Current batch finished! Loading next batch...');
      loadMoreProducts();
    }
  }, [cards.length, loading, hasMoreProducts, loadingMore]);

  // Handle the swipe action from the card component
  const handleSwipe = (productId: string, direction: 'left' | 'right') => {
    // If swiped right, add to cart
    if (direction === 'right') {
      const product = cards.find(c => c._id === productId);
      if (product && !addedToCart.has(product._id)) {
        setAddedToCart(prev => new Set([...prev, product._id]));
        addToCart(product._id, 1, 'M').catch(error => {
          console.error('Failed to add to cart:', error);
          // Revert UI state if backend call fails
          setAddedToCart(prev => {
            const newSet = new Set(prev);
            newSet.delete(product._id);
            return newSet;
          });
        });
      }
    }

    // Set exit direction for the animation
    setCards(prev =>
      prev.map(c => (c._id === productId ? { ...c, exitDirection: direction } : c))
    );

    // After the animation, remove the card from the state
    setTimeout(() => {
      setCards(prev => prev.filter(c => c._id !== productId));
    }, 350);
  };

  const handleBack = () => navigate('/');
  const handleViewBag = () => navigate('/bag');

  const swipedInBatch = useMemo(() => currentBatchSize.current - cards.length, [cards.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  if (!loading && cards.length === 0 && !hasMoreProducts) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        <div className="text-center">
           <p className="text-white text-xl mb-4">🎉 You've discovered everything!</p>
           <p className="text-xs opacity-80 mt-1">{seenProductIds.size} products explored</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-white text-purple-900 px-6 py-2 rounded-lg font-semibold"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 px-4 py-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between">
          <button onClick={handleBack} className="p-2 bg-gray-800/80 backdrop-blur-sm rounded-full hover:bg-gray-700 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="text-center">
            <p className="text-sm opacity-80">{cards.length} remaining</p>
            <p className="text-xs opacity-60">Batch {currentPage} • {seenProductIds.size} seen</p>
          </div>
          <button onClick={handleViewBag} className="p-2 bg-gray-800/80 backdrop-blur-sm rounded-full relative hover:bg-gray-700 transition-colors">
            <ShoppingBag size={20} />
            {addedToCart.size > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {addedToCart.size}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute top-16 left-4 right-4 z-20">
        <div className="bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-400 to-purple-400 rounded-full h-2 transition-all duration-300"
            style={{ width: `${currentBatchSize.current > 0 ? (swipedInBatch / currentBatchSize.current) * 100 : 0}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-400">Batch {currentPage}</span>
          <span className="text-xs text-gray-400">{swipedInBatch}/{currentBatchSize.current} swiped</span>
        </div>
      </div>

      {/* Card Deck */}
      <div className="flex-1 flex items-center justify-center w-full overflow-hidden px-4 select-none">
        <div className="w-full max-w-sm h-[670px] relative">
          <AnimatePresence>
            {cards.map((product, index) => (
              <SwipeableCard
                key={product._id}
                product={product}
                onSwipe={handleSwipe}
                index={index}
                total={cards.length}
              />
            ))}
          </AnimatePresence>

          {/* Loading indicator for next batch */}
          {loadingMore && (
             <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-2xl">
                <div className="text-center text-white bg-black/50 backdrop-blur-md p-4 rounded-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-3"></div>
                    <p>Loading more...</p>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

const SwipeProductsPage: React.FC = () => {
  return <Deck />;
};

export default SwipeProductsPage;