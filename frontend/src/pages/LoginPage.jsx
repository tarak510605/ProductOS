import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await api.post('/auth/login', form);
      login(response.data.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="login-page">
      <div className="login-shell card">
        <aside className="login-visual">
          <p className="pill">ProductOS</p>
          <h1>Welcome Back</h1>
          <p>Sign in to manage your inventory, monitor stock, and keep your workspace in sync.</p>
        </aside>

        <div className="login-form-panel">
          <form className="login-form" onSubmit={onSubmit}>
            <h2>Login</h2>
            <p className="sub">Access your dashboard.</p>
            <label>
              Email
              <input type="email" name="email" value={form.email} onChange={onChange} required />
            </label>
            <label>
              Password
              <input type="password" name="password" value={form.password} onChange={onChange} required />
            </label>
            <button disabled={submitting}>{submitting ? 'Signing in...' : 'Login'}</button>
          </form>
          {error && <p className="error">{error}</p>}
          <p className="auth-footnote">
            New here? <Link to="/register">Create account</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
