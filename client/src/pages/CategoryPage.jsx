import { useLocation } from 'react-router-dom';
import { ProductList } from "../components/ProductList";
import { ALL_CATEGORIES } from '../constants/categories';

export const CategoryPage = () => {
    const location = useLocation();

    // Find category name by current path
    const categoryObj = ALL_CATEGORIES.find(cat => cat.path === location.pathname);
    const categoryName = categoryObj ? categoryObj.name : 'Products';

    return (
        <main className="page-content" style={{ padding: '2rem 2rem', width: '100%' }}>
            {/* <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>{categoryName}</h1> */}
            <ProductList category={categoryName} />
        </main>
    );
};
