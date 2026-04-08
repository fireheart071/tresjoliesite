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
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', category],
    queryFn: () => fetchProducts(category)
  });

  if (isLoading) return <div className="featured-loading">Loading {category || 'all'} pieces...</div>;
  if (error) return <div className="featured-error">Error: {error.message}</div>;

  return (
    <div className="products-grid">
      {Array.isArray(data?.products) && data.products.map((product) => (
        <GalleryCard key={product._id} product={product} />
      ))}
      {(!data?.products || data.products.length === 0) && (
        <div style={{ gridColumn: '1 / -1', padding: '5rem 0', textAlign: 'center' }}>
          <p className="no-products text-muted" style={{ fontStyle: 'italic', fontSize: '1.1rem' }}>
            No products found in this category yet.
          </p>
        </div>
      )}
    </div>
  );
};
