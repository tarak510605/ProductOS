import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      await api.post('/auth/register', form);
      setMessage('Registration successful. Redirecting to login...');
      setTimeout(() => navigate('/login'), 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-layout">
      <aside className="auth-brand card">
        <p className="pill">ProductOS</p>
        <h1>Create account</h1>
        <p className="sub">Start managing products with a clean, role-based workspace.</p>
        <ul>
          <li>Secure JWT authentication</li>
          <li>Role-aware dashboard access</li>
          <li>Fast CRUD workflow</li>
        </ul>
      </aside>

      <div className="auth-shell">
        <form className="card auth-card" onSubmit={onSubmit}>
          <h2>Sign up</h2>
          <label>
            Name
            <input name="name" value={form.name} onChange={onChange} required />
          </label>
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={onChange} required />
          </label>
          <label>
            Password
            <input type="password" name="password" value={form.password} onChange={onChange} required />
          </label>
          <button disabled={submitting}>{submitting ? 'Creating...' : 'Register'}</button>
        </form>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        <p className="auth-footnote">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
}

export default RegisterPage;
