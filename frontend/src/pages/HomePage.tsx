import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, User, MapPin } from 'lucide-react';
import { handleSearch } from '../utils/getProducts';

interface Brand {
  _id: string;
  name: string;
  logo_url?: string;
  is_active: boolean;
  created_at?: string; // Add this to match the backend's `createdAt` field
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedGender, setSelectedGender] = useState<'MAN' | 'WOMAN'>('MAN');

  const [allBrands, setAllBrands] = useState<Brand[]>([]);
  const [latestBrands, setLatestBrands] = useState<Brand[]>([]); // New state for latest brands
  const [trendingBrands, setTrendingBrands] = useState<Brand[]>([]); // New state for trending brands
  const [loadingBrands, setLoadingBrands] = useState(true);

  // --- EXISTING HARDCODED DATA (Keep these for categories, iconic looks, and offers) ---
  // ... (your menCategories, womenCategories, menIconicLooks, etc., remain here)
  const menCategories = [
    { id: 'oversized', label: 'Oversized T-shirt', image: 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'shirts', label: 'Formal Shirts', image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'jeans', label: 'Jeans', image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'cargos', label: 'Cargos & Parachutes', image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'hoodies', label: 'Hoodies', image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'jackets', label: 'Jackets', image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'coords', label: 'Co-ords', image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'shorts', label: 'Shorts', image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ];

  const womenCategories = [
    { id: 'dresses', label: 'Dresses', image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'tops', label: 'Tops & Blouses', image: 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'skirts', label: 'Skirts', image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'jeans-women', label: 'Jeans', image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'blazers', label: 'Blazers', image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'coords-women', label: 'Co-ords', image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'jumpsuits', label: 'Jumpsuits', image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'cardigans', label: 'Cardigans', image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ];
  const currentCategories = selectedGender === 'MAN' ? menCategories : womenCategories;

  const menIconicLooks = [
    { id: 'street-wear', label: 'STREET WEAR', image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'old-money', label: 'OLD MONEY', image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'casual-chic', label: 'CASUAL CHIC', image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ];
  const womenIconicLooks = [
    { id: 'y2k', label: 'Y2K', image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'boho-chic', label: 'BOHO CHIC', image: 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'minimalist', label: 'MINIMALIST', image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ];
  const currentIconicLooks = selectedGender === 'MAN' ? menIconicLooks : womenIconicLooks;

  const menOffers = [
    { id: 'starting', title: 'STARTING', price: '₹499', color: 'bg-green-600', image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'flat30', title: 'FLAT', discount: '30%', subtitle: 'OFF', color: 'bg-blue-600', image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'buy2get1', title: 'BUY 2 GET 1', subtitle: 'FREE', color: 'bg-red-600', image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'under1299', title: 'EVERYTHING UNDER', price: '₹1,299', color: 'bg-purple-600', image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ];
  const womenOffers = [
    { id: 'starting-women', title: 'STARTING', price: '₹399', color: 'bg-pink-600', image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'flat40', title: 'FLAT', discount: '40%', subtitle: 'OFF', color: 'bg-purple-600', image: 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'buy3get2', title: 'BUY 3 GET 2', subtitle: 'FREE', color: 'bg-red-600', image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'under899', title: 'EVERYTHING UNDER', price: '₹899', color: 'bg-green-600', image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ];
  const currentOffers = selectedGender === 'MAN' ? menOffers : womenOffers;

  const carouselSlides = [
    {
      id: 1,
      brand: 'HOUSE OF KOALA',
      title: 'BUY 2 GET 1 FREE',
      subtitle: 'LIMITED TIME DEAL',
      bgColor: 'bg-gradient-to-br from-gray-100 to-gray-200',
      textColor: 'text-black',
      images: [
        'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=300',
        'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=300',
        'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300'
      ]
    },
    {
      id: 2,
      brand: 'SUMMER COLLECTION',
      title: 'UP TO 50% OFF',
      subtitle: 'NEW ARRIVALS',
      bgColor: 'bg-gradient-to-br from-blue-400 to-blue-600',
      textColor: 'text-white',
      images: [
        'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=300',
        'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=300',
        'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300'
      ]
    },
    {
      id: 3,
      brand: 'STREETWEAR',
      title: 'FRESH DROPS',
      subtitle: 'EXCLUSIVE STYLES',
      bgColor: 'bg-gradient-to-br from-orange-400 to-red-500',
      textColor: 'text-white',
      images: [
        'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=300',
        'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=300',
        'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300'
      ]
    }
  ];

  const searchSuggestions = [
    'Green Nature T-Shirt',
    'Mini Dress', 'Urban Blazers', 'Tailored trousers',
    'Street Shorts', 'Chinos', 'Relaxed Joggers', 'Hoodie'
  ];
  // --- END EXISTING HARDCODED DATA ---

  // Carousel state and handlers (unchanged)
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [carouselSlides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  const goToSlide = (index: number) => setCurrentSlide(index);
  const handleTouchStart = (e: React.TouchEvent) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
  const handleTouchMove = (e: React.TouchEvent) => { setTouchEnd(e.targetTouches[0].clientX); };
  const handleTouchEnd = () => { if (!touchStart || !touchEnd) return; const distance = touchStart - touchEnd; const isLeftSwipe = distance > 50; const isRightSwipe = distance < -50; if (isLeftSwipe) { nextSlide(); } else if (isRightSwipe) { prevSlide(); } };
  const handleMouseDown = (e: React.MouseEvent) => { setIsDragging(true); setTouchEnd(null); setTouchStart(e.clientX); };
  const handleMouseMove = (e: React.MouseEvent) => { if (!isDragging) return; setTouchEnd(e.clientX); };
  const handleMouseUp = () => { if (!isDragging) return; setIsDragging(false); if (!touchStart || !touchEnd) return; const distance = touchStart - touchEnd; const isLeftSwipe = distance > 50; const isRightSwipe = distance < -50; if (isLeftSwipe) { nextSlide(); } else if (isRightSwipe) { prevSlide(); } };
  const handleMouseLeave = () => setIsDragging(false);

  // --- UPDATED BRAND FETCHING LOGIC ---
  useEffect(() => {
    const fetchBrands = async () => {
      setLoadingBrands(true);
      try {
        // Fetch all active brands
        const allRes = await fetch("http://localhost:5002/api/brands");
        if (!allRes.ok) throw new Error(`HTTP error! status: ${allRes.status}`);
        const allData: Brand[] = await allRes.json();
        const activeAllBrands = allData.filter(brand => brand.is_active);
        setAllBrands(activeAllBrands);

        // Fetch latest brands (using the 'sort=latest' query parameter)
        const latestRes = await fetch("http://localhost:5002/api/brands?sort=latest");
        if (!latestRes.ok) throw new Error(`HTTP error! status: ${latestRes.status}`);
        const latestData: Brand[] = await latestRes.json();
        // Filter for active brands if your backend doesn't already do it for 'latest' sort
        const activeLatestBrands = latestData.filter(brand => brand.is_active);
        setLatestBrands(activeLatestBrands);

        // For trending, for now, we'll just take a slice of all brands.
        // In a real app, you'd have a separate endpoint or property for trending.
        setTrendingBrands(activeAllBrands.slice(0, 4)); // Example: first 4 active brands as trending

      } catch (err) {
        console.error("Error fetching brands:", err);
        // Optionally, set an error state to display a message to the user
      } finally {
        setLoadingBrands(false);
      }
    };

    fetchBrands();
  }, []); // Empty dependency array means this runs once on mount

  // --- DERIVED STATES FOR LATEST DROPS (using the fetched `latestBrands` state) ---
  const getLatestDropsByGender = (gender: 'MAN' | 'WOMAN') => {
    // For a real application, you'd likely want to fetch latest brands specifically by gender from the backend.
    // For now, this will show the overall latest brands fetched, regardless of the selected gender,
    // as your backend currently provides a general 'latest' sort.
    // If you need gender-specific latest drops, your Brand model would need a 'gender_affinity' field
    // and your backend would need to filter by it.
    // For display, we'll try to find a color, otherwise use a default.
    return latestBrands.map(brand => {
      // You could map specific colors to specific brand names if needed, or use a default.
      // For a more robust solution, your brand model should have a `color` field.
      const colors = ['bg-yellow-600', 'bg-gray-800', 'bg-purple-400', 'bg-blue-600', 'bg-pink-500', 'bg-red-500', 'bg-green-600'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)]; // Just for demo
      return {
        id: brand._id,
        brand: brand.name,
        image: brand.logo_url || 'https://via.placeholder.com/100', // Use logo_url or a placeholder
        color: randomColor // Assign a color or fetch from brand data if available
      };
    });
  };

  const currentLatestDropsDynamic = getLatestDropsByGender(selectedGender);

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/collection?category=${categoryId}&gender=${selectedGender.toLowerCase()}`);
  };

  const handleBrandClick = (brandId: string) => {
    navigate(`/brands/${brandId}`); // Assuming you have a route like /brands/:id
  };

  const handleOfferClick = (offerId: string) => {
    navigate(`/collection?offer=${offerId}`);
  };

  const handleSearchSuggestion = (suggestion: string) => {
    handleSearch(suggestion, navigate)
  };

  const handleGenderChange = (gender: 'MAN' | 'WOMAN') => {
    setSelectedGender(gender);
    setTimeout(() => {
      const categoriesSection = document.querySelector('[data-section="categories"]');
      if (categoriesSection) {
        categoriesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen pb-32">
      {/* Top Header */}
  

      {/* User Selection */}
      <div className="flex items-center justify-center space-x-4 px-4 py-4">
        <button
          onClick={() => handleGenderChange('MAN')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
            selectedGender === 'MAN'
              ? 'bg-white text-black shadow-lg'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <img
            src="https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100"
            alt="Man"
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-sm font-medium">MAN</span>
        </button>
        <button
          onClick={() => handleGenderChange('WOMAN')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
            selectedGender === 'WOMAN'
              ? 'bg-white text-black shadow-lg'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <span className="text-sm font-medium">WOMAN</span>
          <img
            src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100"
            alt="Woman"
            className="w-6 h-6 rounded-full object-cover"
          />
        </button>
      </div>

      {/* Brand Logo (Your main app logo, not individual brands) */}
      <div className="text-center py-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1 h-6 bg-white transform rotate-12"></div>
            ))}
          </div>
          <h1 className="text-2xl font-bold">
            <span className="text-gray-400 text-xs">+ CERTIFIED +</span>
          </h1>
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1 h-6 bg-white transform -rotate-12"></div>
            ))}
          </div>
        </div>
        <h1 className="text-3xl font-bold mt-1">
          <span className="text-blue-400">DRIP</span>
          <span className="text-white">&</span>
          <span className="text-white">TER</span>
        </h1>
        <div className="flex items-center justify-center space-x-2 mt-2">
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1 h-6 bg-white transform rotate-12"></div>
            ))}
          </div>
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1 h-6 bg-white transform -rotate-12"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Auto-playing Carousel */}
      <div className="px-4 mb-6">
        <div
          className="relative rounded-3xl overflow-hidden h-96 cursor-grab active:cursor-grabbing select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {carouselSlides.map((slide) => (
              <div
                key={slide.id}
                className={`min-w-full h-full relative ${slide.bgColor} flex items-center justify-center`}
              >
                <div className="absolute top-4 left-4 z-10">
                  <div className="flex items-center space-x-1">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">🐨</span>
                    </div>
                    <span className={`text-sm font-bold ${slide.textColor}`}>{slide.brand}</span>
                  </div>
                </div>
                <div className={`text-center z-10 ${slide.textColor}`}>
                  <h2 className="text-4xl font-bold mb-2">{slide.title}</h2>
                  <p className="text-lg font-medium opacity-80">{slide.subtitle}</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <div className="grid grid-cols-3 gap-6 w-full max-w-lg px-8">
                    {slide.images.map((image, imgIndex) => (
                      <div key={imgIndex} className="aspect-[3/4] transform hover:scale-105 transition-transform">
                        <img
                          src={image}
                          alt={`Product ${imgIndex + 1}`}
                          className="w-full h-full object-cover rounded-xl shadow-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="px-4 mb-8" data-section="categories">
        <h2 className="text-xl font-bold mb-4">
          {selectedGender === 'MAN' ? "Men's" : "Women's"} Categories
        </h2>
        <div className="grid grid-cols-4 gap-3 transition-all duration-500 ease-in-out">
          {currentCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="text-center hover:scale-105 transition-transform"
            >
              <div className="bg-gray-800 rounded-2xl p-3 mb-2 aspect-square flex items-center justify-center hover:bg-gray-700 transition-colors">
                <img
                  src={category.image}
                  alt={category.label}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <p className="text-xs font-medium text-white">{category.label}</p>
            </button>
          ))}
        </div>
        <div className="flex justify-center space-x-2 mt-4">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
        </div>
      </div>

      {/* What's your next iconic look? */}
      <div className="px-4 mb-8">
        <h2 className="text-xl font-bold mb-4">
          {selectedGender === 'MAN' ? "Men's" : "Women's"} Iconic Looks
        </h2>
        <div className="grid grid-cols-3 gap-3 transition-all duration-500 ease-in-out">
          {currentIconicLooks.map((look) => (
            <button
              key={look.id}
              onClick={() => navigate(`/collection?style=${look.id}`)}
              className="relative rounded-2xl overflow-hidden h-32 hover:scale-105 transition-transform"
            >
              <img
                src={look.image}
                alt={look.label}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end hover:bg-opacity-30 transition-all">
                <p className="text-white font-bold text-sm p-3">{look.label}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Latest Drops (Uses fetched `latestBrands` data) */}
      <div className="px-4 mb-8">
        <h2 className="text-xl font-bold mb-4">
          {selectedGender === 'MAN' ? "Man's Latest Brands" : "Women's Latest Brands"}
        </h2>
        {loadingBrands ? (
          <p className="text-gray-400">Loading latest brands...</p>
        ) : currentLatestDropsDynamic.length === 0 ? (
          <p className="text-gray-400">No latest brands found.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 transition-all duration-500 ease-in-out">
            {currentLatestDropsDynamic.map((drop) => (
              <button
                key={drop.id}
                onClick={() => handleBrandClick(drop.id)}
                className={`${drop.color} rounded-2xl p-4 h-48 relative overflow-hidden hover:scale-105 transition-transform`}
              >
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-bold text-lg">{drop.brand}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-white text-sm mr-2">→</span>
                  </div>
                </div>
                <img
                  src={drop.image}
                  alt={drop.brand}
                  className="absolute right-0 top-0 w-24 h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Offers */}
      <div className="px-4 mb-8">
        <h2 className="text-xl font-bold mb-4">
          {selectedGender === 'MAN' ? "Men's" : "Women's"} Offers
        </h2>
        <div className="grid grid-cols-2 gap-3 transition-all duration-500 ease-in-out">
          {currentOffers.map((offer) => (
            <button
              key={offer.id}
              onClick={() => handleOfferClick(offer.id)}
              className={`${offer.color} rounded-2xl p-4 h-32 relative overflow-hidden hover:scale-105 transition-transform`}
            >
              <div className="absolute top-4 left-4 z-10">
                <p className="text-white font-bold text-sm">{offer.title}</p>
                {offer.price && <p className="text-white font-bold text-2xl">{offer.price}</p>}
                {offer.discount && <p className="text-white font-bold text-2xl">{offer.discount}</p>}
                {offer.subtitle && <p className="text-white font-bold text-sm">{offer.subtitle}</p>}
              </div>
              <img
                src={offer.image}
                alt={offer.title}
                className="absolute right-0 bottom-0 w-16 h-20 object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Trending Brands (Uses fetched `trendingBrands` data) */}
      <div className="px-4 mb-8">
        <h2 className="text-xl font-bold mb-4">Trending Brands</h2>
        {loadingBrands ? (
          <p className="text-gray-400">Loading trending brands...</p>
        ) : trendingBrands.length === 0 ? (
          <p className="text-gray-400">No trending brands found.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {trendingBrands.map((brand) => (
              <button
                key={brand._id}
                onClick={() => handleBrandClick(brand._id)}
                className="bg-gray-800 rounded-2xl overflow-hidden h-48 relative hover:scale-105 transition-transform"
              >
                <img
                  src={brand.logo_url || 'https://via.placeholder.com/200'}
                  alt={brand.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded">
                  <p className="text-black font-bold text-sm">{brand.name}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* All Brands Section */}
      <div className="px-4 mb-8">
        <h2 className="text-xl font-bold mb-4">All Brands</h2>
        {loadingBrands ? (
          <p className="text-gray-400">Loading all brands...</p>
        ) : allBrands.length === 0 ? (
          <p className="text-gray-400">No brands found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {allBrands.map((brand) => (
              <button
                key={brand._id}
                onClick={() => handleBrandClick(brand._id)}
                className="bg-gray-800 p-3 rounded-lg flex flex-col items-center justify-center text-center hover:bg-gray-700 transition-colors"
              >
                {brand.logo_url ? (
                  <img
                    src={brand.logo_url}
                    alt={brand.name}
                    className="w-16 h-16 object-contain mb-2 rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-700 flex items-center justify-center rounded-full mb-2">
                    <span className="text-xs text-gray-300">No Logo</span>
                  </div>
                )}
                <p className="text-sm font-semibold text-white">{brand.name}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* No Clue? Start Here! */}
      <div className="px-4 mb-8">
        <h2 className="text-xl font-bold mb-4">No Clue? Start Here!</h2>
        <div className="grid grid-cols-3 gap-2">
          {searchSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSearchSuggestion(suggestion)}
              className="bg-gray-800 text-white px-3 py-2 rounded-full text-xs font-medium hover:bg-gray-700 transition-colors flex items-center space-x-1"
            >
              <Search size={12} />
              <span>{suggestion}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Swipe Products Button */}
      <div className="px-4 mb-6">
        <button
          onClick={() => navigate('/swipe')}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all transform hover:scale-105 shadow-lg"
        >
          <div className="flex items-center justify-center space-x-3">
            <span className="text-2xl">💫</span>
            <div className="text-left">
              <div className="text-lg font-bold">Discover Products</div>
              <div className="text-sm opacity-90">Swipe like Tinder!</div>
            </div>
            <span className="text-2xl">👉</span>
          </div>
        </button>
      </div>

      {/* Quick Test Button (for development/testing) */}
      <div className="px-4 mb-6">
        <button
          onClick={() => navigate('/checkout', {
            state: {
              product: {
                id: 'test-1',
                name: 'Test Product',
                brand: 'Test Brand',
                price: '₹999',
                images: ['https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=200'],
                selectedSize: 'M',
                quantity: 1
              },
              directBuy: true
            }
          })}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-full transition-colors"
        >
          🛒 Test Checkout (Quick Access)
        </button>
      </div>

      {/* Footer Message */}
      <div className="px-4 mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2 text-gray-300">CURATING CONFIDENCE</h2>
        <h2 className="text-2xl font-bold mb-4 text-gray-300">ONE OUTFIT AT A TIME.</h2>
        <p className="text-gray-400">Always, <span className="font-bold">KNOT</span> Team</p>
      </div>
    </div>
  );
};

export default HomePage;