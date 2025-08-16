import axios from 'axios'

export const handleSearch = async (query: string, navigate: any) => {
    //search implementation here
    try{
      if (query.trim()) {
        const res = await axios.post(`http://localhost:5002/api/products/search`, {
          query 
        });
        navigate('/products', { state: res.data  })
      }
    } catch (err) {
      console.error(err)
    }
  };