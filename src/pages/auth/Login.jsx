import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const nextErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!emailPattern.test(email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!password) {
      nextErrors.password = 'Password is required.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await login(email, password);
      navigate(`/${data.user.role}`);
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid email or password.';
      setErrors((current) => ({ ...current, password: message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-4rem)] items-center lg:grid-cols-2">
      <div className="hidden min-h-[calc(100vh-4rem)] overflow-hidden border-r border-brand-border bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center lg:flex lg:items-end">
        <div className="w-full bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent p-12 pt-32">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand">FITBOOK / MEMBER ACCESS</p>
          <p className="display-font mt-3 max-w-lg text-5xl font-bold uppercase leading-none text-white">Your next strong session starts here.</p>
        </div>
      </div>
      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
        <div className="rounded-2xl border border-brand-border bg-brand-card p-8 shadow-glow">
          <div className="text-center mb-8">
            <h1 className="display-font text-4xl font-bold uppercase text-white">Welcome back</h1>
            <p className="mt-2 text-slate-400">Select your role and continue training.</p>
          </div>
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((current) => ({ ...current, email: '' }));
                }}
                className={`w-full rounded-xl border bg-slate-950 px-4 py-3 text-black placeholder:text-slate-600 focus:border-brand focus:outline-none ${errors.email ? 'border-red-500' : 'border-brand-border'}`}
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && <p className="mt-1 text-sm text-red-300">{errors.email}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((current) => ({ ...current, password: '' }));
                }}
                className={`w-full rounded-xl border bg-slate-950 px-4 py-3 text-black placeholder:text-slate-600 focus:border-brand focus:outline-none ${errors.password ? 'border-red-500' : 'border-brand-border'}`}
                placeholder="Enter your password"
                aria-invalid={Boolean(errors.password)}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-300" role="alert">
                  {errors.password}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand py-3 font-bold text-brand-dark transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-brand hover:text-brand-hover">
              Create one
            </Link>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
