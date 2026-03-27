import { ProductList } from "../components/ProductList";

export const Jewelery = () => {
    return (
        <main className="page-content" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem' }}>Jewelry</h1>
            <ProductList category="Jewelry" />
        </main>
    );
};