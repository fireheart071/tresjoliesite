import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './AuthContext';
import './Admin.css';

const API_URL = 'http://localhost:5000/api/products';

export const Admin = () => {
    const { token, logout } = useAuth();
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({ name: '', category: 'Clothing', price: '', featured: false });
    const [editingId, setEditingId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    // API Functions
    const fetchProducts = async () => {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch products');
        return response.json();
    };

    const saveProduct = async ({ product, id }) => {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_URL}/${id}` : API_URL;
        
        // Handle file upload if present
        const data = new FormData();
        data.append('name', product.name);
        data.append('category', product.category);
        data.append('price', product.price);
        data.append('featured', product.featured);
        if (imageFile) {
            data.append('image', imageFile);
        }

        const response = await fetch(url, {
            method,
            headers: { 
                'Authorization': `Bearer ${token}`
                // Note: Content-Type is set automatically for FormData
            },
            body: data
        });
        
        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || 'Failed to save product');
        }
        return response.json();
    };

    const deleteProduct = async (id) => {
        const response = await fetch(`${API_URL}/${id}`, { 
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to delete product');
        return response.json();
    };

    // React Query
    const { data: products, isLoading, error } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts
    });

    const saveMutation = useMutation({
        mutationFn: saveProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['featuredProducts'] });
            handleCloseModal();
        },
        onError: (err) => alert(err.message)
    });

    const deleteMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
        onError: (err) => alert(err.message)
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        saveMutation.mutate({ product: formData, id: editingId });
    };

    const handleEdit = (product) => {
        setFormData({ name: product.name, category: product.category, price: product.price, featured: product.featured || false });
        setImageFile(null); // Keep or reset image? Typically reset unless a new file is picked.
        setEditingId(product._id);
        setShowModal(true);
    };

    const handleOpenModal = () => {
        setFormData({ name: '', category: 'Clothing', price: '', featured: false });
        setImageFile(null);
        setEditingId(null);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingId(null);
    };

    const handleDelete = (id) => {
        if (!window.confirm('Are you sure?')) return;
        deleteMutation.mutate(id);
    };

    if (isLoading) return <div className="admin-status">Loading portal...</div>;
    if (error) return <div className="admin-status">Error: {error.message}</div>;

    return (
        <div className="admin-container">
            <nav className="admin-navbar">
                <div className="admin-navbar-inner">
                    <span className="admin-logo">T&amp;J Control</span>
                    <div className="admin-nav-actions">
                        <button onClick={handleOpenModal} className="btn-add">Add Product</button>
                        <button onClick={logout} className="logout-btn">Logout</button>
                    </div>
                </div>
            </nav>

            <main className="admin-main">
                <header className="admin-header">
                    <h1>Store Inventory</h1>
                    <p>Manage your products and collections.</p>
                </header>

                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Featured</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product._id}>
                                    <td>
                                        <div className="img-preview-sm">
                                            {product.image && <img src={product.image} alt={product.name} />}
                                        </div>
                                    </td>
                                    <td>{product.name}</td>
                                    <td>{product.category}</td>
                                    <td>{product.price}</td>
                                    <td>{product.featured ? 'Yes' : 'No'}</td>
                                    <td>
                                        <button className="btn-icon" onClick={() => handleEdit(product)}>Edit</button>
                                        <button className="btn-icon btn-delete" onClick={() => handleDelete(product._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select name="category" value={formData.category} onChange={handleInputChange}>
                                    <option value="Clothing">Clothing</option>
                                    <option value="Jewelry">Jewelry</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Price</label>
                                <input type="text" name="price" value={formData.price} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Product Image</label>
                                <input type="file" onChange={handleFileChange} accept="image/*" />
                            </div>
                            <div className="form-group checkbox-group">
                                <label>
                                    <input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} />
                                    Featured Item
                                </label>
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="btn-save" disabled={saveMutation.isPending}>
                                    {saveMutation.isPending ? 'Saving...' : (editingId ? 'Update' : 'Create')}
                                </button>
                                <button type="button" onClick={handleCloseModal} className="btn-cancel">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
