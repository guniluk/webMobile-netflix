import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaTrash, FaFilm, FaTv, FaUser } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useContentStore } from '../store/contentStore';

export default function Search() {
  const [activeTab, setActiveTab] = useState('movie'); // 'movie', 'tv', 'person'
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState('');
  const { setContentType } = useContentStore();

  // Fetch search history
  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await axios.get('/api/v1/search/history');
      if (res.data.success) {
        setSearchHistory(res.data.content || []);
      }
    } catch (err) {
      console.error('Error fetching search history:', err.message);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    const hisFetch = () => {
      fetchHistory();
    };
    hisFetch();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const res = await axios.get(
        `/api/v1/search/${activeTab}/${encodeURIComponent(query)}`,
      );
      if (res.data.success) {
        setResults(res.data.content || []);
        // Refresh history after a successful search because backend saves it to DB
        fetchHistory();
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError('No results found. Try another query.');
      } else {
        setError('An error occurred while searching.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHistory = async (id) => {
    try {
      const res = await axios.delete(`/api/v1/search/history/${id}`);
      if (res.data.success) {
        setSearchHistory((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Error deleting history:', err.message);
    }
  };

  const getTabIcon = (tab) => {
    if (tab === 'movie') return <FaFilm />;
    if (tab === 'tv') return <FaTv />;
    return <FaUser />;
  };

  return (
    <div className="relative min-h-screen bg-[#141414] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full pt-28 pb-16 px-4">
        {/* Tab Controls */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8">
          {['movie', 'tv', 'person'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setResults([]);
                setError('');
              }}
              className={`btn btn-sm sm:btn-md capitalize font-semibold flex items-center gap-1.5 sm:gap-2 rounded-full border border-zinc-800 transition-all text-xs sm:text-sm ${
                activeTab === tab
                  ? 'bg-red-600 text-white border-red-600 hover:bg-red-700'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {getTabIcon(tab)}{' '}
              {tab === 'person'
                ? 'People'
                : tab === 'tv'
                  ? 'TV Shows'
                  : 'Movies'}
            </button>
          ))}
        </div>

        {/* Search Bar Input */}
        <form
          onSubmit={handleSearch}
          className="max-w-2xl mx-auto mb-12 flex gap-3 px-4 sm:px-0"
        >
          <input
            type="text"
            placeholder={`Search for a ${activeTab === 'person' ? 'person' : activeTab === 'tv' ? 'TV show' : 'movie'}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input input-bordered flex-1 bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 text-sm md:text-base"
          />
          <button
            type="submit"
            className="btn btn-sm sm:btn-md btn-error bg-red-600 hover:bg-red-700 border-none text-white px-4 sm:px-6"
          >
            <FaSearch size={16} />
          </button>
        </form>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center my-12">
            <span className="loading loading-spinner loading-lg text-red-600"></span>
          </div>
        )}

        {/* Error Messages */}
        {error && (
          <p className="text-center text-zinc-400 my-8 text-lg px-4">{error}</p>
        )}

        {/* Search Results Grid */}
        {results.length > 0 && !loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6 mb-16 px-4 sm:px-0">
            {results.map((item) => {
              const imagePath =
                activeTab === 'person' ? item.profile_path : item.poster_path;
              const title =
                activeTab === 'person' ? item.name : item.title || item.name;
              const imageUrl = imagePath
                ? `https://image.tmdb.org/t/p/w500${imagePath}`
                : 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750"><rect width="100%" height="100%" fill="%231c1c1c"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%238c8c8c" font-family="sans-serif" font-size="24" font-weight="bold">No Image</text></svg>';

              return (
                <div
                  key={item.id}
                  className="bg-zinc-900/60 rounded-lg overflow-hidden border border-zinc-800/80 shadow-md group"
                >
                  {activeTab === 'person' ? (
                    <div className="flex flex-col items-center p-3 sm:p-4">
                      <img
                        src={imageUrl}
                        alt={title}
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover mb-3 sm:mb-4 border border-zinc-700 group-hover:scale-105 transition-transform duration-300"
                      />
                      <p className="font-bold text-xs sm:text-sm text-center text-white line-clamp-1">
                        {title}
                      </p>
                      <p className="text-zinc-500 text-[10px] sm:text-xs mt-1 text-center line-clamp-1">
                        {item.known_for_department || 'Actor'}
                      </p>
                    </div>
                  ) : (
                    <Link
                      to={`/watch/${item.id}`}
                      onClick={() => {
                        setContentType(activeTab);
                      }}
                    >
                      <div className="relative overflow-hidden aspect-2/3">
                        <img
                          src={imageUrl}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 sm:p-3 text-center">
                          <p className="font-bold text-xs sm:text-sm text-white drop-shadow-md">
                            {title}
                          </p>
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Search History Section */}
        {searchHistory.length > 0 && !loading && !historyLoading && (
          <div className="border-t border-zinc-800 pt-10 px-4 sm:px-0">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-white flex items-center gap-2">
              Recent Search History
            </h2>
            <div className="flex flex-col gap-3 max-w-3xl mx-auto">
              {searchHistory.map((item, idx) => {
                const historyImageUrl = item.image
                  ? `https://image.tmdb.org/t/p/w200${item.image}`
                  : 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="150" viewBox="0 0 100 150"><rect width="100%" height="100%" fill="%231c1c1c"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%238c8c8c" font-family="sans-serif" font-size="12" font-weight="bold">No Image</text></svg>';

                return (
                  <div
                    key={`${item.id}-${idx}`}
                    className="flex justify-between items-center bg-zinc-900/40 border border-zinc-800/80 rounded-lg p-2.5 sm:p-3 hover:bg-zinc-900/80 transition-colors"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <img
                        src={historyImageUrl}
                        alt={item.title}
                        className="w-10 h-14 sm:w-12 sm:h-16 object-cover rounded border border-zinc-800 shadow"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-xs sm:text-sm text-white truncate">
                          {item.title}
                        </p>
                        <span className="text-zinc-500 text-[10px] sm:text-xs capitalize flex items-center gap-1.5 mt-1">
                          {getTabIcon(item.searchType)} {item.searchType}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteHistory(item.id)}
                      className="btn btn-ghost btn-circle text-zinc-500 hover:text-red-500 transition-colors"
                      title="Delete entry"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
