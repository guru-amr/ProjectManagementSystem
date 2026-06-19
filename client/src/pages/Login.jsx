import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email required';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const submit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      toast.error(err.error || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={submit}>
        <h2>Sign In</h2>
        <div className="field">
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={change} />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>
        <div className="field">
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={change} />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>
        <button className="btn btn-primary" disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</button>
        <p>No account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
}
