import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaSignOutAlt, FaHistory, FaBars } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';
import { useContentStore } from '../store/contentStore';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { user, logout } = useAuthStore();
  const { contentType, setContentType } = useContentStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    const res = await logout();
    if (res.success) {
      navigate('/login');
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out px-4 md:px-12 py-4 flex items-center justify-between ${
        isScrolled
          ? 'bg-[#141414]/95 shadow-md backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      {/* Left side: Logo & Navigation */}
      <div className="flex items-center gap-8">
        <Link
          to="/"
          className="text-red-600 font-extrabold text-2xl md:text-3xl tracking-wider hover:opacity-90 transition-opacity"
        >
          BYH VIDEOS
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <button
            onClick={() => {
              setContentType('movie');
              navigate('/');
            }}
            className={`hover:text-gray-300 transition-colors font-medium cursor-pointer ${
              location.pathname === '/' && contentType === 'movie'
                ? 'text-white border-b-2 border-red-600 pb-0.5'
                : 'text-gray-400'
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => {
              setContentType('tv');
              navigate('/');
            }}
            className={`hover:text-gray-300 transition-colors font-medium cursor-pointer ${
              location.pathname === '/' && contentType === 'tv'
                ? 'text-white border-b-2 border-red-600 pb-0.5'
                : 'text-gray-400'
            }`}
          >
            TV Shows
          </button>
          <Link
            to="/search"
            className={`hover:text-gray-300 transition-colors font-medium flex items-center gap-1.5 ${
              location.pathname === '/search'
                ? 'text-white border-b-2 border-red-600 pb-0.5'
                : 'text-gray-400'
            }`}
          >
            Search History
          </Link>
        </div>
      </div>

      {/* Right side: User actions */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link
              to="/search"
              className="text-gray-300 hover:text-white transition-colors p-2"
              title="Search"
            >
              <FaSearch size={18} />
            </Link>

            {/* User Dropdown */}
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn btn-ghost btn-circle avatar cursor-pointer w-12 h-12"
              >
                <div className="w-12 h-12 rounded-full border-2 border-white bg-red-600 flex items-center justify-center text-white font-bold uppercase overflow-hidden">
                  {!imgError && user.image ? (
                    <img
                      src={user.image}
                      alt="user profile"
                      onError={() => setImgError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg">
                      {user.username ? user.username.charAt(0) : 'U'}
                    </span>
                  )}
                </div>
              </label>
              <ul
                tabIndex={0}
                className="mt-3 z-1 p-2 shadow-2xl menu menu-sm dropdown-content bg-zinc-950 border border-zinc-800 rounded-box w-52 text-gray-200"
              >
                <li className="px-4 py-2 border-b border-zinc-800">
                  <span className="font-semibold text-white block truncate">
                    {user.username}
                  </span>
                  <span className="text-xs text-gray-500 block truncate">
                    {user.email}
                  </span>
                </li>
                <li>
                  <Link to="/search" className="py-2 flex items-center gap-2">
                    <FaHistory /> Search History
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="py-2 text-red-400 hover:text-red-300 flex items-center gap-2"
                  >
                    <FaSignOutAlt /> Sign Out
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <Link
            to="/login"
            className="btn btn-sm btn-error text-white font-bold bg-red-600 border-none hover:bg-red-700"
          >
            Sign In
          </Link>
        )}

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-300 hover:text-white p-2"
        >
          <FaBars size={20} />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-zinc-950 border-b border-zinc-800 flex flex-col p-4 gap-4 text-sm md:hidden animate-fade-in">
          <button
            onClick={() => {
              setContentType('movie');
              setMobileMenuOpen(false);
              navigate('/');
            }}
            className={`text-left py-2 px-4 rounded hover:bg-zinc-900 ${
              location.pathname === '/' && contentType === 'movie'
                ? 'bg-zinc-900 text-white font-semibold'
                : 'text-gray-400'
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => {
              setContentType('tv');
              setMobileMenuOpen(false);
              navigate('/');
            }}
            className={`text-left py-2 px-4 rounded hover:bg-zinc-900 ${
              location.pathname === '/' && contentType === 'tv'
                ? 'bg-zinc-900 text-white font-semibold'
                : 'text-gray-400'
            }`}
          >
            TV Shows
          </button>
          <Link
            to="/search"
            onClick={() => setMobileMenuOpen(false)}
            className={`text-left py-2 px-4 rounded hover:bg-zinc-900 ${
              location.pathname === '/search'
                ? 'bg-zinc-900 text-white font-semibold'
                : 'text-gray-400'
            }`}
          >
            Search History
          </Link>
        </div>
      )}
    </nav>
  );
}
