import { useQuery } from '@tanstack/react-query';
import { GalleryCard } from './GalleryCard';
import { API_BASE_URL } from '../config';
import './Featured.css';

const fetchProducts = async (category) => {
  let url = `${API_BASE_URL}/products`;
  if (category) url += `?category=${category}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

export const ProductList = ({ category }) => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', category],
    queryFn: () => fetchProducts(category)
  });

  if (isLoading) return <div className="featured-loading">Loading {category || 'all'} pieces...</div>;
  if (error) return <div className="featured-error">Error: {error.message}</div>;

  return (
    <div className="featured-grid">
      {products.map((product) => (
        <GalleryCard key={product._id} product={product} />
      ))}
      {products.length === 0 && <p className="no-products">No products found in this category.</p>}
    </div>
  );
};
