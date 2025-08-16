
interface Product {
  _id: string;
  name: string;
  description?: string;
  images: string[];
  price: {
    $numberDecimal: string;
  };
  currency: string;
  sizes: string[];
  fits: string[];
  tags: string[];
  stock: number;
  gender: string;
  brand: string;
  category: string[];
}

const fetchProducts = async (page: number = 1, limit: number = 10, excludeIds: string[] = []): Promise<Product[]> => {
  try {
    let url = `http://casa-backend-uf0h.onrender.com/api/products?page=${page}&limit=${limit}`;

    // Add exclude parameter if we have IDs to exclude
    if (excludeIds.length > 0) {
      url += `&exclude=${excludeIds.join(',')}`;
    }

    console.log(`📦 Fetching products page ${page} (excluding ${excludeIds.length} seen products)`);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    console.log(`✅ Fetched ${data.length} new products for page ${page}`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return [];
  }
};

export default fetchProducts;
