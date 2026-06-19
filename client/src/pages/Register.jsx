import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

function validate(form) {
  const errs = {};
  if (!form.fullName.trim()) errs.fullName = 'Full name is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email required';
  if (form.password.length < 6) errs.password = 'Min 6 characters';
  return errs;
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    try {
      await register(form);
      toast.success('Registered! Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.error || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={submit}>
        <h2>Create Account</h2>
        <div className="field">
          <label>Full Name</label>
          <input name="fullName" value={form.fullName} onChange={change} />
          {errors.fullName && <span className="field-error">{errors.fullName}</span>}
        </div>
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
        <button className="btn btn-primary" disabled={loading}>{loading ? 'Registering…' : 'Register'}</button>
        <p>Already have an account? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  );
}
