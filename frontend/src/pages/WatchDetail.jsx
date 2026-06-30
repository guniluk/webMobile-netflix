import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaCalendarAlt,
  FaChevronCircleLeft,
} from 'react-icons/fa';
import { useContentStore } from '../store/contentStore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function WatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contentType } = useContentStore();
  const [details, setDetails] = useState(null);
  const [trailers, setTrailers] = useState([]);
  const [currentTrailerIdx, setCurrentTrailerIdx] = useState(0);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const similarSliderRef = useRef(null);

  const updateSimilarArrows = () => {
    if (similarSliderRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = similarSliderRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    const fetchWatchData = async () => {
      setLoading(true);
      setError('');
      try {
        // 1. Fetch details
        const detailsRes = await axios.get(`/api/v1/${contentType}/${id}/details`);
        if (detailsRes.data.success) {
          setDetails(detailsRes.data.content);
        }

        // 2. Fetch trailers
        const trailersRes = await axios.get(`/api/v1/${contentType}/${id}/trailers`);
        if (trailersRes.data.success) {
          // Filter only YouTube trailers
          const ytTrailers = (trailersRes.data.trailers || []).filter(
            (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
          );
          setTrailers(ytTrailers.length > 0 ? ytTrailers : trailersRes.data.trailers || []);
          setCurrentTrailerIdx(0);
        }

        // 3. Fetch similar items
        const similarRes = await axios.get(`/api/v1/${contentType}/${id}/similar`);
        if (similarRes.data.success) {
          setSimilar(similarRes.data.similar || []);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Content not found');
        } else {
          setError('Failed to fetch video details.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWatchData();
  }, [id, contentType]);

  useEffect(() => {
    if (similar.length > 0) {
      const handle = setTimeout(() => {
        updateSimilarArrows();
      }, 100);
      return () => clearTimeout(handle);
    }
  }, [similar]);

  useEffect(() => {
    window.addEventListener('resize', updateSimilarArrows);
    return () => {
      window.removeEventListener('resize', updateSimilarArrows);
    };
  }, []);

  const handleNextTrailer = () => {
    if (currentTrailerIdx < trailers.length - 1) {
      setCurrentTrailerIdx((prev) => prev + 1);
    }
  };

  const handlePrevTrailer = () => {
    if (currentTrailerIdx > 0) {
      setCurrentTrailerIdx((prev) => prev - 1);
    }
  };

  const scrollSimilar = (direction) => {
    if (similarSliderRef.current) {
      const { scrollLeft, clientWidth } = similarSliderRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      similarSliderRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-red-600"></span>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4 text-center">
          <h2 className="text-3xl font-bold text-zinc-400">{error || 'Something went wrong.'}</h2>
          <Link to="/" className="btn btn-error bg-red-600 hover:bg-red-700 text-white font-bold">
            Go Back Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const hasTrailer = trailers.length > 0 && trailers[currentTrailerIdx]?.key;
  const releaseYear = details.release_date?.split('-')[0] || details.first_air_date?.split('-')[0];

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col pb-20">
      <Navbar />

      <main className="flex-1 pt-24 max-w-6xl mx-auto w-full px-0 sm:px-4">
        {/* Back Button */}
        <div className="px-4 sm:px-0">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost hover:bg-zinc-900 text-gray-300 hover:text-white mb-6 flex items-center gap-2"
          >
            <FaChevronCircleLeft size={20} /> Back
          </button>
        </div>

        {/* Trailer Video Player Section */}
        <div className="w-full aspect-video bg-zinc-950 sm:rounded-lg overflow-hidden border-y sm:border border-zinc-800/80 shadow-2xl relative mb-10 group">
          {hasTrailer ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${trailers[currentTrailerIdx].key}?autoplay=0`}
              title="Trailer video"
              className="w-full h-full"
              allowFullScreen
            />
          ) : (
            <div
              className="w-full h-full bg-cover bg-center flex flex-col items-center justify-center p-6 text-center"
              style={{
                backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.5)), url('https://image.tmdb.org/t/p/original${details.backdrop_path || details.poster_path}')`,
              }}
            >
              <p className="text-lg md:text-2xl font-bold text-zinc-300 mb-2">
                No trailer available
              </p>
              <p className="text-zinc-500 text-xs md:text-sm">
                We couldn't find a YouTube trailer for this content.
              </p>
            </div>
          )}

          {/* Trailer Pagination Buttons */}
          {trailers.length > 1 && (
            <div className="absolute bottom-4 right-4 flex items-center gap-3 bg-black/60 px-3 py-1.5 rounded-full border border-zinc-800 z-10">
              <button
                onClick={handlePrevTrailer}
                disabled={currentTrailerIdx === 0}
                className="text-white disabled:text-zinc-600 transition-colors"
              >
                <FaChevronLeft size={16} />
              </button>
              <span className="text-xs font-semibold text-zinc-300">
                {currentTrailerIdx + 1} / {trailers.length}
              </span>
              <button
                onClick={handleNextTrailer}
                disabled={currentTrailerIdx === trailers.length - 1}
                className="text-white disabled:text-zinc-600 transition-colors"
              >
                <FaChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Content Info Section */}
        <div className="px-4 sm:px-0 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-16">
          {/* Poster Image */}
          <div className="flex justify-center md:justify-start">
            <img
              src={
                details.poster_path
                  ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
                  : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO0F7e0AAAAASUVORK5CYII='
              }
              alt={details.title || details.name}
              className="w-full max-w-50 sm:max-w-70 md:max-w-[320px] rounded-lg shadow-xl border border-zinc-800 object-cover"
            />
          </div>

          {/* Details */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black">
              {details.title || details.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-zinc-400">
              <span className="flex items-center gap-1.5">
                <FaCalendarAlt /> {releaseYear || 'N/A'}
              </span>
              <span className="flex items-center gap-1.5 text-green-500 font-semibold">
                <FaStar /> {details.vote_average?.toFixed(1) || '0.0'}
              </span>
              {details.adult && (
                <span className="bg-red-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                  18+
                </span>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {details.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="badge badge-outline border-zinc-700 text-zinc-300 py-2 px-3 text-xs"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Overview / Storyline */}
            <div>
              <h3 className="font-bold text-base sm:text-lg mb-2 text-zinc-200">Overview</h3>
              <p className="text-zinc-300 leading-relaxed text-xs sm:text-sm md:text-base">
                {details.overview || 'No storyline summary available.'}
              </p>
            </div>
          </div>
        </div>

        {/* Similar Suggestions Section */}
        {similar.length > 0 && (
          <div className="px-4 sm:px-0 relative group/similar border-t border-zinc-900 pt-10">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-white capitalize">
              More Like This
            </h2>

            {/* Slider navigation buttons */}
            <button
              onClick={() => scrollSimilar('left')}
              className={`absolute left-0 top-[60%] -translate-y-1/2 z-30 bg-black/60 hover:bg-black/85 hover:scale-110 text-white p-3 rounded-full flex items-center justify-center border border-zinc-800 transition-all duration-300 opacity-0 pointer-events-none ${showLeftArrow ? 'group-hover/similar:opacity-100 group-hover/similar:pointer-events-auto' : ''}`}
            >
              <FaChevronLeft size={18} />
            </button>

            {/* Similar Movies Slider */}
            <div
              ref={similarSliderRef}
              onScroll={updateSimilarArrows}
              className="flex gap-4 overflow-x-auto scrollbar-none py-4 scroll-smooth"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {similar.map((item) => {
                const imgPath = item.backdrop_path || item.poster_path;
                const imgUrl = imgPath
                  ? `https://image.tmdb.org/t/p/w500${imgPath}`
                  : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO0F7e0AAAAASUVORK5CYII=';

                return (
                  <Link
                    key={item.id}
                    to={`/watch/${item.id}`}
                    className="min-w-35 sm:min-w-47.5 md:min-w-65 relative rounded-md overflow-hidden transition-all duration-300 hover:scale-105 shadow-md group"
                  >
                    <img
                      src={imgUrl}
                      alt={item.title || item.name}
                      className="w-full aspect-video object-cover rounded-md"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-linear-to from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                      <p className="text-white text-xs font-semibold truncate">
                        {item.title || item.name}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            <button
              onClick={() => scrollSimilar('right')}
              className={`absolute right-0 top-[60%] -translate-y-1/2 z-30 bg-black/60 hover:bg-black/85 hover:scale-110 text-white p-3 rounded-full flex items-center justify-center border border-zinc-800 transition-all duration-300 opacity-0 pointer-events-none ${showRightArrow ? 'group-hover/similar:opacity-100 group-hover/similar:pointer-events-auto' : ''}`}
            >
              <FaChevronRight size={18} />
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
