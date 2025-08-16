import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Heart, User, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import LoginPopup from "./LoginPopup";
import { useUser } from "../contexts/UserContext";

const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const { userData } = useUser();

  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());
  const [liveAddress, setLiveAddress] = useState("Delivery Location");

  useEffect(() => {
    const saved = localStorage.getItem("savedAddress");
    if (saved) setLiveAddress(saved);
  }, []);

  const handleSearch = () => navigate("/search");
  const handleProfile = () => navigate("/profile");
  const handleWishlist = () => navigate("/wishlist");
  const handleLocationClick = () => navigate("/location");

  const loadWishlist = async () => {
    try {
      const userId = userData?._id || "dummyUserId";
      const res = await fetch(`https://casa-backend-uf0h.onrender.com/api/curatedlist/${userId}`);
      if (res.ok) {
        const data = await res.json();
        const ids = data.map((item: any) => item.product._id);
        setWishlistItems(new Set(ids));
      }
    } catch (err) {
      console.error("Error loading wishlist:", err);
    }
  };

  useEffect(() => {
    if (userData?.isLoggedIn) {
      loadWishlist();
      // ✅ Listen for changes from anywhere in the app
      const handleUpdate = () => {
        loadWishlist();
      };

      window.addEventListener("wishlistUpdated", handleUpdate);

      return () => {
        window.removeEventListener("wishlistUpdated", handleUpdate);
      };
    }
  }, [userData?.isLoggedIn]);

  return (
    <>
      {/* Fixed, centered to phone width */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[413px] pt-[env(safe-area-inset-top)]">
        <header className="bg-gray-900/95 text-white border-b border-gray-800 backdrop-blur supports-[backdrop-filter]:bg-gray-900/70 rounded-b-xl">
          <div className="h-14 px-4 flex items-center justify-between">
            <button
              onClick={handleLocationClick}
              className="group flex items-center gap-2 rounded-full px-2 py-2 -ml-2 hover:bg-white/5 active:bg-white/10"
              aria-label="Change delivery location"
            >
              <MapPin size={18} className="text-blue-400" />
              <span className="text-sm text-blue-300 font-semibold truncate max-w-[200px] sm:max-w-[240px]">
                {liveAddress}
              </span>
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={handleSearch}
                className="h-10 w-10 grid place-items-center rounded-full hover:bg-white/5 active:bg-white/10"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <motion.button
                onClick={handleWishlist}
                className="relative h-10 w-10 grid place-items-center rounded-full hover:bg-white/5 active:bg-white/10"
                aria-label="Wishlist"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <Heart
                  size={20}
                  className={wishlistItems.size > 0 ? "text-red-500 fill-current" : "text-white"}
                />
                {wishlistItems.size > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-red-500 text-[10px] leading-5 text-white text-center"
                  >
                    {wishlistItems.size > 99 ? "99+" : wishlistItems.size}
                  </motion.span>
                )}
              </motion.button>

              <button
                onClick={handleProfile}
                className="h-10 w-10 grid place-items-center rounded-full hover:bg-white/5 active:bg-white/10"
                aria-label="Profile"
              >
                <User size={20} />
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Hidden by default */}
      <LoginPopup isOpen={false} onClose={() => {}} onContinue={() => {}} />
    </>
  );
};

export default TopBar;
