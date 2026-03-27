import { ProductList } from "../components/ProductList";

export const Clothing = () => {
    return (
        <main className="page-content" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem' }}>Clothing</h1>
            <ProductList category="Clothing" />
        </main>
    );
};