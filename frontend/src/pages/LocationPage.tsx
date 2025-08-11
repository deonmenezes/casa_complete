import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { ArrowLeft } from 'lucide-react';


const LocationPage = () => {
  const navigate = useNavigate();
  const [center, setCenter] = useState({ lat: 19.0760, lng: 72.8777 }); // Default: Mumbai
  const [liveAddress, setLiveAddress] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [formData, setFormData] = useState({ flat: '', wing: '', landmark: '' });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyAHUYOhT1nlx85i9r4xCZsRUIkKchAxCsk',
    libraries: ['places'] 
  });

  const getAddressFromCoords = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAHUYOhT1nlx85i9r4xCZsRUIkKchAxCsk`
      );
      const data = await res.json();
      if (data.status === 'OK' && data.results.length > 0) {
        setLiveAddress(data.results[0].formatted_address);
      } else {
        setLiveAddress('No address found for this location');
      }
    } catch (err) {
      console.error('Reverse geocoding failed:', err);
      setLiveAddress('Unable to fetch address');
    }
  };

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCenter({ lat: latitude, lng: longitude });
        await getAddressFromCoords(latitude, longitude);
        setLoadingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        if (error.code === 1) {
          alert('Permission denied. Please allow location access in browser settings.');
        } else if (error.code === 2) {
          alert('Position unavailable. Try again.');
        } else {
          alert('Timeout or unknown error.');
        }
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    getAddressFromCoords(center.lat, center.lng);
  }, [center]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveLocation = () => {
    const full = `${formData.flat}, ${formData.wing}, ${formData.landmark}, ${liveAddress}`;
    localStorage.setItem('savedAddress', full);
    navigate('/swipe'); // Update route if needed
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* 🔙 Header */}
      <div className="p-4 flex items-center border-b border-gray-800">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="text-white" />
        </button>
        <h2 className="text-lg font-semibold ml-4">Location Information</h2>
      </div>

      {/* 🗺 Map */}
      <div className="relative w-full h-[300px]">
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={center}
            zoom={16}
            onClick={(e) => {
              const lat = e.latLng?.lat() || center.lat;
              const lng = e.latLng?.lng() || center.lng;
              setCenter({ lat, lng });
              getAddressFromCoords(lat, lng);
            }}
            options={{
              disableDefaultUI: true,
              styles: [
                {
                  featureType: 'all',
                  elementType: 'geometry.fill',
                  stylers: [{ color: '#1F2937' }],
                },
                {
                  featureType: 'water',
                  elementType: 'geometry.fill',
                  stylers: [{ color: '#111827' }],
                },
              ],
            }}
          >
            <Marker
              position={center}
              draggable
              onDragEnd={(e) => {
                const lat = e.latLng?.lat() || center.lat;
                const lng = e.latLng?.lng() || center.lng;
                setCenter({ lat, lng });
                getAddressFromCoords(lat, lng);
              }}
            />
          </GoogleMap>
        )}
      </div>

      {/* 📍 Location Button & Address Form */}
      <div className="px-4 mt-4">
        <button
          onClick={fetchLocation}
          className="w-full border border-blue-400 text-blue-300 px-3 py-2 rounded mb-3"
        >
          {loadingLocation ? 'Fetching location...' : '📍 Use My Current Location'}
        </button>

        {/* 📦 Address Preview */}
        <div className="text-xs text-gray-400 mb-1">Detected Address:</div>
        <div className="text-sm font-medium mb-3">
          {liveAddress || 'Searching...'}
        </div>

        {/* 🏠 Inputs */}
        <input
          name="flat"
          placeholder="Flat / House No."
          value={formData.flat}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded mb-3 text-black"
        />
        <input
          name="wing"
          placeholder="Wing / Building"
          value={formData.wing}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded mb-3 text-black"
        />
        <input
          name="landmark"
          placeholder="Landmark"
          value={formData.landmark}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded mb-4 text-black"
        />

        <button
          onClick={saveLocation}
          className="w-full bg-pink-600 text-white px-4 py-2 rounded font-semibold"
        >
          Confirm & Continue
        </button>
      </div>
    </div>
  );
};

export default LocationPage;
