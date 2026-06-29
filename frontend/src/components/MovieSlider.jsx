import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useContentStore } from '../store/contentStore';

export default function MovieSlider({ title, category }) {
  const { contentType } = useContentStore();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/v1/${contentType}/${category}`);
        if (res.data.succcess) {
          setList(res.data.content || []);
        }
      } catch (error) {
        console.error('Error fetching slider data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [contentType, category]);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const scrollTo =
        direction === 'left'
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      sliderRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="my-8 px-4 md:px-12">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-white capitalize">
          {title}
        </h2>
        <div className="flex gap-4 overflow-x-hidden py-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="min-w-37.5 sm:min-w-50 md:min-w-62.5 aspect-video bg-zinc-900 rounded-md animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (list.length === 0) return null;

  return (
    <div className="relative my-8 px-4 md:px-12 group/slider">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-white capitalize">
        {title}
      </h2>

      {/* Left button */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/85 text-white p-2 rounded-full hidden group-hover/slider:flex items-center justify-center transition-all duration-300 border border-zinc-800"
      >
        <FaChevronLeft size={20} />
      </button>

      {/* Slider Container */}
      <div
        ref={sliderRef}
        className="flex gap-4 overflow-x-auto scrollbar-none py-4 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {list.map((item) => {
          const imagePath = item.backdrop_path || item.poster_path;
          const imageUrl = imagePath
            ? `https://image.tmdb.org/t/p/w500${imagePath}`
            : 'https://via.placeholder.com/500x281/1c1c1c/ffffff?text=No+Image';

          return (
            <Link
              key={item.id}
              to={`/watch/${item.id}`}
              className="min-w-45 sm:min-w-55 md:min-w-70 relative rounded-md overflow-hidden transition-all duration-300 hover:scale-105 hover:z-20 shadow-lg hover:shadow-black/70 group"
            >
              <img
                src={imageUrl}
                alt={item.title || item.name}
                className="w-full aspect-video object-cover rounded-md"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <p className="text-white text-xs md:text-sm font-semibold truncate">
                  {item.title || item.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded">
                    HD
                  </span>
                  <span className="text-[10px] text-green-500 font-semibold">
                    ★ {item.vote_average?.toFixed(1) || '0.0'}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Right button */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/85 text-white p-2 rounded-full hidden group-hover/slider:flex items-center justify-center transition-all duration-300 border border-zinc-800"
      >
        <FaChevronRight size={20} />
      </button>
    </div>
  );
}
