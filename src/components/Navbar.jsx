import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, Dumbbell, LogOut, Menu, Moon, Sun, X } from 'lucide-react';

const Navbar = ({ theme, onToggleTheme }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const navLink = (to, label) => (
    <Link
      to={to}
      onClick={() => setMenuOpen(false)}
      className="block px-3 py-2 rounded hover:bg-blue-700 transition-colors"
    >
      {label}
    </Link>
  );

  return (
    <nav className={`sticky top-0 z-50 border-b backdrop-blur-md ${theme === 'light' ? 'border-slate-200 bg-white/90 text-slate-900' : 'border-brand-border bg-brand-dark/90 text-white'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link to={user ? `/${user.role}` : '/'} className="flex items-center gap-2">
            <span className="rounded-xl bg-brand p-2 text-brand-dark shadow-glow"><Dumbbell className="h-5 w-5" /></span>
            <span className="text-xl font-black tracking-wider">FIT<span className="text-brand">BOOK</span></span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onToggleTheme}
              className="rounded-xl border border-brand-border p-2 text-slate-300 transition hover:border-brand hover:text-brand"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            {user ? (
              <>
                <span className="hidden text-sm text-slate-500 sm:inline">Welcome, <span className={`font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{user.name}</span></span>
                <span className="rounded border border-brand/20 bg-brand/10 px-2 py-1 text-xs capitalize text-brand">{user.role}</span>
                {navLink(`/${user.role}`, 'Dashboard')}
                <Link to="/profile" className="hidden rounded px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white md:block">Profile</Link>
                <button className="hidden rounded-xl p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white md:block" aria-label="Notifications"><Bell className="h-5 w-5" /></button>
                <button
                  onClick={handleLogout}
                  className="hidden items-center gap-2 rounded-xl border border-red-500/20 px-3 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/10 md:flex"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 text-sm text-slate-300 transition hover:text-brand">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-brand px-4 py-2 text-sm font-bold text-brand-dark transition hover:bg-brand-hover"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-xl p-2 transition hover:bg-slate-800 md:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className={`border-t md:hidden ${theme === 'light' ? 'border-slate-200 bg-white' : 'border-brand-border bg-slate-950'}`}>
          <div className="px-4 py-3 space-y-1">
            <button
              onClick={onToggleTheme}
              className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-slate-300 transition hover:bg-slate-800 hover:text-brand"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              Switch to {theme === 'dark' ? 'light' : 'dark'} theme
            </button>
            {user ? (
              <>
                <p className={`border-b pb-2 text-sm ${theme === 'light' ? 'border-slate-200 text-slate-500' : 'border-brand-border text-slate-400'}`}>
                  {user.name} ({user.role})
                </p>
                {navLink(`/${user.role}`, 'Dashboard')}
                {navLink('/profile', 'My Profile')}
                <button
                  onClick={handleLogout}
                  className="w-full rounded px-3 py-2 text-left text-red-300 transition hover:bg-red-500/10"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {navLink('/login', 'Login')}
                {navLink('/register', 'Register')}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
