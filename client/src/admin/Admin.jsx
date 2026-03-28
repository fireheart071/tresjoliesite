import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../config';
import './Admin.css';

const PRODUCTS_API = `${API_BASE_URL}/products`;

export const Admin = () => {
    const { token, logout } = useAuth();
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({ name: '', category: 'Clothing', price: '', featured: false, images: [] });
    const [editingId, setEditingId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [imageFiles, setImageFiles] = useState([]);

    // API Functions
    const fetchProducts = async () => {
        const response = await fetch(PRODUCTS_API);
        if (!response.ok) throw new Error('Failed to fetch products');
        return response.json();
    };

    const saveProduct = async ({ product, id }) => {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${PRODUCTS_API}/${id}` : PRODUCTS_API;
        
        const data = new FormData();
        data.append('name', product.name);
        data.append('category', product.category);
        data.append('price', product.price);
        data.append('featured', product.featured);
        
        if (id) {
            data.append('existingImages', JSON.stringify(product.images));
        }

        if (imageFiles.length > 0) {
            imageFiles.forEach(file => {
                data.append('images', file);
            });
        }

        const response = await fetch(url, {
            method,
            headers: { 
                'Authorization': `Bearer ${token}`
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
        const response = await fetch(`${PRODUCTS_API}/${id}`, { 
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
        const files = Array.from(e.target.files);
        setImageFiles([...imageFiles, ...files]);
    };

    const removeNewFile = (index) => {
        setImageFiles(imageFiles.filter((_, i) => i !== index));
    };

    const removeExistingImage = (url) => {
        setFormData({ ...formData, images: formData.images.filter(img => img !== url) });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        saveMutation.mutate({ product: formData, id: editingId });
    };

    const handleEdit = (product) => {
        setFormData({ 
            name: product.name, 
            category: product.category, 
            price: product.price, 
            featured: product.featured || false,
            images: product.images || []
        });
        setImageFiles([]);
        setEditingId(product._id);
        setShowModal(true);
    };

    const handleOpenModal = () => {
        setFormData({ name: '', category: 'Clothing', price: '', featured: false, images: [] });
        setImageFiles([]);
        setEditingId(null);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingId(null);
    };

    const handleDelete = (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
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
                                <th>Images</th>
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
                                        <div className="img-preview-row">
                                            {product.images?.slice(0, 3).map((img, i) => (
                                                <img key={i} src={img} alt="" className="img-preview-sm" />
                                            ))}
                                            {product.images?.length > 3 && <span className="more-count">+{product.images.length - 3}</span>}
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
                    <div className="modal-content admin-modal">
                        <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-grid">
                                <div className="form-column">
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
                                    <div className="form-group checkbox-group">
                                        <label>
                                            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} />
                                            Featured Item
                                        </label>
                                    </div>
                                </div>

                                <div className="form-column">
                                    <label>Gallery</label>
                                    <div className="gallery-manager">
                                        <div className="image-grid-admin">
                                            {/* Existing Images */}
                                            {formData.images.map((img, i) => (
                                                <div key={i} className="admin-img-card">
                                                    <img src={img} alt="" />
                                                    <button type="button" className="img-remove-btn" onClick={() => removeExistingImage(img)}>&times;</button>
                                                </div>
                                            ))}
                                            {/* New file previews */}
                                            {imageFiles.map((file, i) => (
                                                <div key={`new-${i}`} className="admin-img-card new-img">
                                                    <img src={URL.createObjectURL(file)} alt="" />
                                                    <button type="button" className="img-remove-btn" onClick={() => removeNewFile(i)}>&times;</button>
                                                </div>
                                            ))}
                                            <label className="add-img-box">
                                                <span>+ Add</span>
                                                <input type="file" multiple onChange={handleFileChange} accept="image/*" hidden />
                                            </label>
                                        </div>
                                    </div>
                                </div>
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
