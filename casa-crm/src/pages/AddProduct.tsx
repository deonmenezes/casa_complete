import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Upload, Camera, Package, DollarSign, Tag, FileText, Layers, AlertCircle, Check, Move } from 'lucide-react';
import { useBrand } from '../contexts/BrandContext'

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  brand: string;
  images: string[];
  tags: string[];
  currency: string;
  sizes: string[];
  fits: string[];
  stock: string;
  is_active: boolean;
  geo_tags: string[];
  gender: "Male" | "Female" | "Unisex";
}

interface FormErrors {
  name?: string;
  price?: string;
  category?: string;
  brand?: string;
  sku?: string;
  stock?: string;
  general?: string;
  gender?: string;
}

const AddProduct = () => {
  const { brand } = useBrand()
  const navigate = useNavigate();
  const [title, setTitle] = useState('Add New')
  const [description, setDescription] = useState('Create a new')
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    images: [''],
    tags: [''],
    currency: '',
    sizes: [''],
    fits: [''],
    stock: '',
    is_active: false,
    geo_tags: [''],
    gender: 'Unisex'
  });
  const location = useLocation();
  const editData = location.state?.product || null;
  
  useEffect(() => {
    if (editData) {
      setFormData({
        ...formData,
        ...editData,
        brand: editData.brand.name,
        category: editData.category[0].name,
        price: editData?.price?.$numberDecimal,
        stock: String(editData.stock),
        images: editData.images.length ? editData.images : [''],
        tags: editData.tags.length ? editData.tags : [''],
        sizes: editData.sizes.length ? editData.sizes : [''],
        fits: editData.fits.length ? editData.fits : [''],
        geo_tags: editData.geo_tags.length ? editData.geo_tags : [''],
      });
      setTitle('Edit')
      setDescription('Edit')
    }
  }, [editData]);
  
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const categories = [
    'Watches',
    'sunglasses',
    'bracelets',
    'watches',
    'Cargos & Parachutes',
    'Jeans',
    'Shirt',
    'Oversized T-shirt',
    'T-Shirts'
  ];

  const gender = [
    'Male',
    'Female',
    'Unisex',
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }

    if (!formData.stock.trim()) {
      newErrors.stock = 'Stock quantity is required';
    } else if (isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = 'Please enter a valid stock quantity';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = (): boolean => {
    return formData.name.trim() !== '' && 
           formData.price.trim() !== '' && 
           !isNaN(Number(formData.price)) &&
           Number(formData.price) > 0 &&
           formData.category !== '' &&
           formData.brand.trim() !== '' &&
           formData.stock.trim() !== '' &&
           !isNaN(Number(formData.stock)) &&
           Number(formData.stock) >= 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        images: newImages
      }));
    }
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData(prev => ({
      ...prev,
      tags: newTags
    }));
  };

  const handleSizesChange = (index: number, value: string) => {
    const newSizes = [...formData.sizes];
    newSizes[index] = value;
    setFormData(prev => ({
      ...prev,
      sizes: newSizes
    }));
  };

  const handleFitsChange = (index: number, value: string) => {
    const newFits = [...formData.fits];
    newFits[index] = value;
    setFormData(prev => ({
      ...prev,
      fits: newFits
    }));
  };

  const handleGTagChange = (index: number, value: string) => {
    const newGeotag = [...formData.geo_tags];
    newGeotag[index] = value;
    setFormData(prev => ({
      ...prev,
      geo_tags: newGeotag
    }));
  };

  const addTagField = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }));
  };

  const addSizeField = () => {
    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, '']
    }))
  }

  const addFitField = () => {
    setFormData(prev => ({
      ...prev,
      fits: [...prev.fits, '']
    }))
  }

  const addGTagField = () => {
    setFormData(prev => ({
      ...prev,
      geo_tags: [...prev.geo_tags, '']
    }));
  };

  const removeTagField = (index: number) => {
    if (formData.tags.length > 1) {
      const newTags = formData.tags.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        tags: newTags
      }));
    }
  };

  const removeSizeField = (index: number) => {
    if (formData.sizes.length > 1) {
      const newSizes = formData.sizes.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        size: newSizes
      }));
    }
  };

  const removeFitField = (index: number) => {
    if (formData.fits.length > 1) {
      const newFits = formData.fits.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        fits: newFits
      }));
    }
  };

  const removeGTagField = (index: number) => {
    if (formData.geo_tags.length > 1) {
      const newGTags = formData.geo_tags.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        geo_tags: newGTags
      }));
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    try {
      const cleanedData = {
        ...formData,
        images: formData.images.filter(img => img.trim() !== ''),
        tags: formData.tags.filter(tag => tag.trim() !== ''),
        price: Number(formData.price),
        stock: Number(formData.stock)
      };

      const response = await fetch(`http://https://casa-backend-uf0h.onrender.com/api/products/update/${editData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });

      if (response.ok) {
        console.log(response)

        setIsSuccess(true);
        setTimeout(() => {
          navigate('/products');
        }, 2000);
      } else {
        const errorData = await response.json();
        console.log(errorData)
        setErrors({ general: errorData.message || 'Failed to update product. Please try again.' });
      }
    }catch (error) {
      setErrors({ general: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Filter out empty images and tags
      const cleanedData = {
        ...formData,
        images: formData.images.filter(img => img.trim() !== ''),
        tags: formData.tags.filter(tag => tag.trim() !== ''),
        price: Number(formData.price),
        stock: Number(formData.stock)
      };

      const response = await fetch('http://https://casa-backend-uf0h.onrender.com/api/products/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });

      if (response.ok) {
        console.log(response)

        setIsSuccess(true);
        setTimeout(() => {
          navigate('/products');
        }, 2000);
      } else {
        const errorData = await response.json();
        console.log(errorData)
        setErrors({ general: errorData.message || 'Failed to create product. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">{title === 'Add New' ? 'Product Added!' : 'Product Updated!'}</h1>
          <p className="text-slate-300 mb-8">
            Your product has been successfully {title === 'Add New' ? 'Added' : 'Updated'} to the catalog.
          </p>
          <Link
            to="/products"
            className="inline-block w-full bg-blue-500 text-white py-4 rounded-2xl font-semibold hover:bg-blue-600 transition-colors"
          >
            View Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-800 px-4 py-6">
      <div className="w-full max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            to="/products"
            className="inline-flex items-center text-slate-400 hover:text-white transition-colors mr-4"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">{title} Product</h1>
            <p className="text-slate-300 text-sm">{description} product listing</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-6 shadow-2xl space-y-6">
          <form onSubmit={title === 'Add New' ? handleSubmit : handleUpdate} className="space-y-5">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <p className="text-red-600 text-sm font-medium">{errors.general}</p>
              </div>
            )}

            {/* Product Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Product Name *
              </label>
              <div className="relative">
                <Package className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:bg-white transition-all shadow-sm text-slate-800 placeholder-slate-400 ${
                    errors.name ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                  }`}
                  placeholder="Enter product name"
                />
              </div>
              {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Price *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:bg-white transition-all shadow-sm text-slate-800 placeholder-slate-400 ${
                    errors.price ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.price && <p className="text-red-500 text-sm mt-2">{errors.price}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Category *
              </label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:bg-white transition-all shadow-sm text-slate-800 ${
                    errors.category ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              {errors.category && <p className="text-red-500 text-sm mt-2">{errors.category}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Gender *
              </label>
              <div className="relative">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:bg-white transition-all shadow-sm text-slate-800 ${
                    errors.gender ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                  }`}
                >
                  <option value="">Select a gender</option>
                  {gender.map((gender) => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
              </div>
              {errors.gender && <p className="text-red-500 text-sm mt-2">{errors.gender}</p>}
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Brand *
              </label>
              <input
                type="text"
                name="brand"
                value={brand?.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-4 bg-slate-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:bg-white transition-all shadow-sm text-slate-800 placeholder-slate-400 ${
                  errors.brand ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
                placeholder="Enter brand name"
              />
              {errors.brand && <p className="text-red-500 text-sm mt-2">{errors.brand}</p>}
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                className={`w-full px-4 py-4 bg-slate-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:bg-white transition-all shadow-sm text-slate-800 placeholder-slate-400 ${
                  errors.stock ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
                placeholder="Enter stock quantity"
              />
              {errors.stock && <p className="text-red-500 text-sm mt-2">{errors.stock}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm text-slate-800 placeholder-slate-400 resize-none"
                  placeholder="Describe your product..."
                />
              </div>
            </div>

            {/* Product Images */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Product Images
              </label>
              <div className="space-y-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Camera className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm text-slate-800 placeholder-slate-400"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="w-12 h-12 bg-red-100 text-red-500 rounded-2xl hover:bg-red-200 transition-colors flex items-center justify-center"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImageField}
                  className="w-full py-3 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-colors flex items-center justify-center space-x-2 font-medium"
                >
                  <Upload className="w-4 h-4" />
                  <span>Add Image URL</span>
                </button>
              </div>
            </div>

            {/* Tags */}
            <div>
              
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Tags
              </label>
              <span>Note*
                </span><span>
                Please use hash-tags wisely, as incorrect use will lead to lower reach
              </span>
              <div className="space-y-3">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleTagChange(index, e.target.value)}
                      className="flex-1 px-4 py-3 bg-slate-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm text-slate-800 placeholder-slate-400"
                      placeholder="Enter tag"
                    />
                    {formData.tags.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTagField(index)}
                        className="w-10 h-10 bg-red-100 text-red-500 rounded-xl hover:bg-red-200 transition-colors flex items-center justify-center"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTagField}
                  className="w-full py-3 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-colors flex items-center justify-center space-x-2 font-medium"
                >
                  <Tag className="w-4 h-4" />
                  <span>Add Tag</span>
                </button>
              </div>
            </div>

            {/* Geo Tags */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Geo-Tags
              </label>
              <div className="space-y-3">
                {formData.geo_tags.map((geo_tag, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={geo_tag}
                      onChange={(e) => handleGTagChange(index, e.target.value)}
                      className="flex-1 px-4 py-3 bg-slate-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm text-slate-800 placeholder-slate-400"
                      placeholder="Enter tag"
                    />
                    {formData.geo_tags.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGTagField(index)}
                        className="w-10 h-10 bg-red-100 text-red-500 rounded-xl hover:bg-red-200 transition-colors flex items-center justify-center"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addGTagField}
                  className="w-full py-3 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-colors flex items-center justify-center space-x-2 font-medium"
                >
                  <Tag className="w-4 h-4" />
                  <span>Add Tag</span>
                </button>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Sizes
              </label>
              <div className="space-y-3">
                {formData.sizes.map((size, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={size}
                      onChange={(e) => handleSizesChange(index, e.target.value)}
                      className="flex-1 px-4 py-3 bg-slate-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm text-slate-800 placeholder-slate-400"
                      placeholder="Enter size"
                    />
                    {formData.sizes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSizeField(index)}
                        className="w-10 h-10 bg-red-100 text-red-500 rounded-xl hover:bg-red-200 transition-colors flex items-center justify-center"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSizeField}
                  className="w-full py-3 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-colors flex items-center justify-center space-x-2 font-medium"
                >
                  <Move className="w-4 h-4" />
                  <span>Add Size</span>
                </button>
              </div>
            </div>

            {/* Fits */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Fits
              </label>
              <div className="space-y-3">
                {formData.fits.map((fit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={fit}
                      onChange={(e) => handleFitsChange(index, e.target.value)}
                      className="flex-1 px-4 py-3 bg-slate-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm text-slate-800 placeholder-slate-400"
                      placeholder="Enter fit"
                    />
                    {formData.fits.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFitField(index)}
                        className="w-10 h-10 bg-red-100 text-red-500 rounded-xl hover:bg-red-200 transition-colors flex items-center justify-center"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFitField}
                  className="w-full py-3 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-colors flex items-center justify-center space-x-2 font-medium"
                >
                  <Move className="w-4 h-4" />
                  <span>Add Fit</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid() || isLoading}
              className="w-full bg-black text-white py-4 rounded-2xl font-semibold hover:bg-slate-900 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Adding Product...' : title}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;