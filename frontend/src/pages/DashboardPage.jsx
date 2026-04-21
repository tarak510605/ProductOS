import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const defaultForm = {
  name: '',
  description: '',
  price: '',
  inStock: true,
  category: ''
};

function DashboardPage() {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const inStockCount = products.filter((product) => product.inStock).length;

  const loadProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const onChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setForm(defaultForm);
    setEditingId(null);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    const payload = {
      ...form,
      price: Number(form.price)
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        setMessage('Product updated');
      } else {
        await api.post('/products', payload);
        setMessage('Product created');
      }

      resetForm();
      await loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    }
  };

  const onEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      inStock: product.inStock,
      category: product.category || ''
    });
  };

  const onDelete = async (id) => {
    setError('');
    setMessage('');

    try {
      await api.delete(`/products/${id}`);
      setMessage('Product deleted');
      if (editingId === id) {
        resetForm();
      }
      await loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <section className="dashboard-shell">
      <header className="topbar card">
        <div>
          <p className="pill">Workspace</p>
          <h1>Product Dashboard</h1>
          <p>
            Signed in as <strong>{user?.name}</strong>
          </p>
        </div>
        <div className="topbar-actions">
          <span className={`role-badge role-${user?.role}`}>{user?.role}</span>
          <button className="danger" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <div className="stat-row">
        <article className="card stat-card">
          <p>Total products</p>
          <h3>{products.length}</h3>
        </article>
        <article className="card stat-card">
          <p>In stock</p>
          <h3>{inStockCount}</h3>
        </article>
        <article className="card stat-card">
          <p>Out of stock</p>
          <h3>{products.length - inStockCount}</h3>
        </article>
      </div>

      <div className="grid">
        <form className="card form-card" onSubmit={onSubmit}>
          <p className="section-kicker">Product editor</p>
          <h2>{editingId ? 'Update product' : 'Add product'}</h2>
          <label>
            Name
            <input name="name" value={form.name} onChange={onChange} required />
          </label>
          <label>
            Description
            <textarea name="description" value={form.description} onChange={onChange} rows={3} />
          </label>
          <label>
            Price
            <input type="number" step="0.01" min="0" name="price" value={form.price} onChange={onChange} required />
          </label>
          <label>
            Category
            <input name="category" value={form.category} onChange={onChange} />
          </label>
          <label className="checkbox">
            <input type="checkbox" name="inStock" checked={form.inStock} onChange={onChange} />
            In stock
          </label>
          <div className="actions">
            <button type="submit">{editingId ? 'Save changes' : 'Create product'}</button>
            {editingId && (
              <button type="button" className="ghost" onClick={resetForm}>
                Cancel edit
              </button>
            )}
          </div>
        </form>

        <div className="card list-card">
          <p className="section-kicker">Inventory</p>
          <h2>Products</h2>
          <div className="list">
            {products.map((product) => (
              <article key={product._id} className="product-item">
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.description || 'No description'}</p>
                  <small>
                    ${product.price} • {product.category || 'General'} • {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </small>
                </div>
                <div className="actions">
                  <button className="ghost" onClick={() => onEdit(product)}>
                    Edit
                  </button>
                  <button className="danger" onClick={() => onDelete(product._id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
            {products.length === 0 && <p className="empty-list">No products yet. Create your first product.</p>}
          </div>
        </div>
      </div>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </section>
  );
}

export default DashboardPage;
