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
      if (res.data.succcess) {
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
      const res = await axios.get(`/api/v1/search/${activeTab}/${encodeURIComponent(query)}`);
      if (res.data.succcess) {
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
      if (res.data.succcess) {
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
        <div className="flex justify-center gap-4 mb-8">
          {['movie', 'tv', 'person'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setResults([]);
                setError('');
              }}
              className={`btn btn-md capitalize font-semibold flex items-center gap-2 rounded-full border border-zinc-800 transition-all ${
                activeTab === tab
                  ? 'bg-red-600 text-white border-red-600 hover:bg-red-700'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {getTabIcon(tab)} {tab === 'person' ? 'People' : tab === 'tv' ? 'TV Shows' : 'Movies'}
            </button>
          ))}
        </div>

        {/* Search Bar Input */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12 flex gap-3">
          <input
            type="text"
            placeholder={`Search for a ${activeTab === 'person' ? 'person' : activeTab === 'tv' ? 'TV show' : 'movie'}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input input-bordered flex-1 bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-red-600"
          />
          <button
            type="submit"
            className="btn btn-error bg-red-600 hover:bg-red-700 border-none text-white px-6"
          >
            <FaSearch size={18} />
          </button>
        </form>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center my-12">
            <span className="loading loading-spinner loading-lg text-red-600"></span>
          </div>
        )}

        {/* Error Messages */}
        {error && <p className="text-center text-zinc-400 my-8 text-lg">{error}</p>}

        {/* Search Results Grid */}
        {results.length > 0 && !loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-16">
            {results.map((item) => {
              const imagePath = activeTab === 'person' ? item.profile_path : item.poster_path;
              const title = activeTab === 'person' ? item.name : item.title || item.name;
              const imageUrl = imagePath
                ? `https://image.tmdb.org/t/p/w500${imagePath}`
                : 'https://via.placeholder.com/500x750/1c1c1c/ffffff?text=No+Image';

              return (
                <div
                  key={item.id}
                  className="bg-zinc-900/60 rounded-lg overflow-hidden border border-zinc-800/80 shadow-md group"
                >
                  {activeTab === 'person' ? (
                    <div className="flex flex-col items-center p-4">
                      <img
                        src={imageUrl}
                        alt={title}
                        className="w-32 h-32 rounded-full object-cover mb-4 border border-zinc-700 group-hover:scale-105 transition-transform duration-300"
                      />
                      <p className="font-bold text-sm text-center text-white line-clamp-1">
                        {title}
                      </p>
                      <p className="text-zinc-500 text-xs mt-1 text-center line-clamp-1">
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
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-center">
                          <p className="font-bold text-sm text-white drop-shadow-md">{title}</p>
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
          <div className="border-t border-zinc-800 pt-10">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-white flex items-center gap-2">
              Recent Search History
            </h2>
            <div className="flex flex-col gap-4 max-w-3xl mx-auto">
              {searchHistory.map((item, idx) => {
                const historyImageUrl = item.image
                  ? `https://image.tmdb.org/t/p/w200${item.image}`
                  : 'https://via.placeholder.com/100x150/1c1c1c/ffffff?text=No+Image';

                return (
                  <div
                    key={`${item.id}-${idx}`}
                    className="flex justify-between items-center bg-zinc-900/40 border border-zinc-800/80 rounded-lg p-3 hover:bg-zinc-900/80 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={historyImageUrl}
                        alt={item.title}
                        className="w-12 h-16 object-cover rounded border border-zinc-800 shadow"
                      />
                      <div>
                        <p className="font-bold text-sm text-white">{item.title}</p>
                        <span className="text-zinc-500 text-xs capitalize flex items-center gap-1.5 mt-1">
                          {getTabIcon(item.searchType)} {item.searchType}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteHistory(item.id)}
                      className="btn btn-ghost btn-circle text-zinc-500 hover:text-red-500 transition-colors"
                      title="Delete entry"
                    >
                      <FaTrash size={14} />
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
