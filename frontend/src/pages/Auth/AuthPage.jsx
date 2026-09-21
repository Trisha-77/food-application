import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../components/context/StoreContext';
import { assets } from '../../assets/assets';
import './AuthPage.css';

const emptyForm = { name: '', email: '', password: '', confirmPassword: '' };

export default function AuthPage({ initialMode = 'signup' }) {
  const { url, login, isAuthenticated, authReady } = useContext(StoreContext);
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState(emptyForm);
  const [visible, setVisible] = useState({ password: false, confirm: false });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { setMode(initialMode); setError(''); setSuccess(''); }, [initialMode]);
  useEffect(() => {
    if (!success) return undefined;
    const redirectTimer = window.setTimeout(() => navigate('/home', { replace: true }), 650);
    return () => window.clearTimeout(redirectTimer);
  }, [success, navigate]);
  if (authReady && isAuthenticated) return <Navigate to="/home" replace />;

  const switchMode = (next) => {
    setMode(next); setError(''); setSuccess('');
    navigate(next === 'login' ? '/login' : '/signup');
  };

  const validate = () => {
    if (mode === 'signup' && form.name.trim().length < 2) return 'Enter your full name (at least 2 characters).';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Enter a valid email address.';
    if (!form.password) return 'Password is required.';
    if (mode === 'signup' && form.password.length < 8) return 'Password must be at least 8 characters.';
    if (mode === 'signup' && form.password !== form.confirmPassword) return 'Passwords do not match.';
    return '';
  };

  const submit = async (event) => {
    event.preventDefault();
    const message = validate();
    if (message) return setError(message);
    setError(''); setSuccess(''); setSubmitting(true);
    try {
      const endpoint = mode === 'login' ? '/api/user/login' : '/api/user/register';
      const payload = mode === 'login'
        ? { email: form.email.trim(), password: form.password }
        : { name: form.name.trim(), email: form.email.trim(), password: form.password };
      const response = await axios.post(url + endpoint, payload);
      if (!response.data.success) throw new Error(response.data.message || 'Something went wrong.');
      login(response.data.token, response.data.user);
      setSuccess(mode === 'login' ? 'Signed in successfully. Redirecting…' : 'Account created successfully. Redirecting…');
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || 'Unable to continue. Please try again.');
    } finally { setSubmitting(false); }
  };

  const field = (key, label, type = 'text', canReveal = false) => <label className="auth-field">
    <span>{label}</span>
    <div className="auth-input-wrap"><input name={key} type={canReveal && visible[key === 'confirmPassword' ? 'confirm' : 'password'] ? 'text' : type}
      value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} autoComplete={key === 'email' ? 'email' : key === 'name' ? 'name' : mode === 'login' ? 'current-password' : 'new-password'} />
      {canReveal && <button className="reveal" type="button" onClick={() => setVisible({ ...visible, [key === 'confirmPassword' ? 'confirm' : 'password']: !visible[key === 'confirmPassword' ? 'confirm' : 'password'] })} aria-label={`Show or hide ${label}`}>{visible[key === 'confirmPassword' ? 'confirm' : 'password'] ? 'Hide' : 'Show'}</button>}
    </div>
  </label>;

  return <main className="auth-page">
    <section className="auth-hero">
      <div className="hero-overlay" />
      <div className="hero-content">
        <Link className="auth-brand" to="/"><span>●</span> Savoury</Link>
        <div className="hero-copy"><p className="eyebrow">MEALS MADE EASY</p><h1>Good food,<br /><em>on your time.</em></h1><p>Discover delicious dishes and order your favourites in just a few clicks.</p></div>
        <div className="hero-points"><span>Curated menus</span><span>Simple ordering</span><span>Made with care</span></div>
      </div>
      <img src={assets.header_img} alt="Fresh food ready to be enjoyed" />
    </section>
    <section className="auth-panel"><div className="auth-card">
      <div className="auth-tabs"><button className={mode === 'login' ? 'selected' : ''} onClick={() => switchMode('login')}>Login</button><button className={mode === 'signup' ? 'selected' : ''} onClick={() => switchMode('signup')}>Sign up</button></div>
      <header><p className="eyebrow">WELCOME TO SAVOURY</p><h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2><p>{mode === 'login' ? 'Sign in to continue ordering your favourite food.' : 'Join us and start ordering delicious food.'}</p></header>
      <form onSubmit={submit} noValidate>{mode === 'signup' && field('name', 'Full name')}{field('email', 'Email', 'email')}{field('password', 'Password', 'password', true)}{mode === 'signup' && field('confirmPassword', 'Confirm password', 'password', true)}
        {error && <p className="auth-message error" role="alert">{error}</p>}{success && <p className="auth-message success">{success}</p>}
        <button className="auth-submit" disabled={submitting || Boolean(success)}>{submitting ? 'Please wait…' : mode === 'login' ? 'Login' : 'Create account'}</button>
      </form>
      <p className="auth-switch">{mode === 'login' ? "Don't have an account?" : 'Already have an account?'} <button onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}>{mode === 'login' ? 'Create an account' : 'Login'}</button></p>
    </div></section>
  </main>;
}
