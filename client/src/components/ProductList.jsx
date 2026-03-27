import { useQuery } from '@tanstack/react-query';
import './Featured.css';

const fetchProducts = async (category) => {
  let url = 'http://localhost:5000/api/products';
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
        <article key={product._id} className="product-card">
          <div className="product-image">
            {product.image && <img src={product.image} alt={product.name} />}
          </div>
          <div className="product-info">
            <span className="product-category">{product.category}</span>
            <h3 className="product-name">{product.name}</h3>
            <span className="product-price">{product.price}</span>
          </div>
        </article>
      ))}
      {products.length === 0 && <p>No products found in this category.</p>}
    </div>
  );
};
