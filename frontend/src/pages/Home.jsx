import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useContentStore } from '../store/contentStore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MovieSlider from '../components/MovieSlider';

export default function Home() {
  const { user } = useAuthStore();
  const { contentType } = useContentStore();
  const [trending, setTrending] = useState(null);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [landingEmail, setLandingEmail] = useState('');
  const navigate = useNavigate();

  // Fetch trending item for hero banner
  useEffect(() => {
    if (!user) return;
    const fetchTrending = async () => {
      setLoadingTrending(true);
      try {
        const res = await axios.get(`/api/v1/${contentType}/trending`);
        if (res.data.success) {
          setTrending(res.data.content);
        }
      } catch (error) {
        console.error('Error fetching trending content:', error.message);
      } finally {
        setLoadingTrending(false);
      }
    };
    fetchTrending();
  }, [user, contentType]);

  const handleLandingSubmit = (e) => {
    e.preventDefault();
    if (landingEmail) {
      navigate(`/signup?email=${encodeURIComponent(landingEmail)}`);
    }
  };

  // 1. Landing Page for Unauthenticated Users
  if (!user) {
    return (
      <div className="relative min-h-screen w-full bg-black text-white flex flex-col">
        {/* Hero Section */}
        <div
          className="relative w-full flex flex-col bg-cover bg-center bg-no-repeat border-b-8 border-zinc-800"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.9) 0, rgba(0, 0, 0, 0.3) 60%, rgba(0, 0, 0, 0.9) 100%), url('https://assets.nflxext.com/ffe/siteui/vlv3/435e8bb8-7f1b-49cb-8da8-bff997124294/web/US-en-20260511-TRIFECTA-perspective_faa2ba65-d9fe-44bc-b4e0-f702a991adaa_large.jpg')`,
            minHeight: '75vh',
          }}
        >
          {/* Navbar */}
          <header className="flex justify-between items-center px-4 md:px-12 py-6 z-10">
            <span className="text-red-600 font-extrabold text-3xl tracking-wider">BYH Videos</span>
            <Link
              to="/login"
              className="btn btn-error btn-sm font-bold text-white bg-red-600 border-none hover:bg-red-700"
            >
              Sign In
            </Link>
          </header>

          {/* Content Body */}
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto z-10 py-12 md:py-20">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 leading-tight">
              Unlimited movies, TV shows, and more
            </h1>
            <p className="text-base sm:text-lg md:text-2xl font-medium mb-6">
              Watch anywhere. Cancel anytime.
            </p>
            <p className="text-xs sm:text-sm md:text-xl text-zinc-300 mb-6">
              Ready to watch? Enter your email to create or restart your membership.
            </p>

            <form
              onSubmit={handleLandingSubmit}
              className="flex flex-col w-full max-w-lg md:max-w-2xl mx-auto md:flex-row gap-4 px-4"
            >
              <input
                type="email"
                placeholder="Email address"
                value={landingEmail}
                onChange={(e) => setLandingEmail(e.target.value)}
                required
                className="input input-bordered w-full flex-1 py-3 md:py-6 bg-black/60 border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 text-sm md:text-base"
              />
              <button
                type="submit"
                className="btn btn-error py-3 md:py-6 font-extrabold text-white text-base md:text-lg bg-red-600 border-none hover:bg-red-700 w-full md:w-auto px-8"
              >
                Get Started &gt;
              </button>
            </form>
          </div>
        </div>

        {/* 2nd Section: Enjoy on your TV */}
        <section className="bg-black py-16 border-b-8 border-zinc-800">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 md:px-12 gap-8">
            {/* Left Text */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 leading-tight">
                Enjoy Movie and TV programs
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-zinc-300">
                Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and
                more.
              </p>
            </div>

            {/* Right Image/Video */}
            <div className="flex-1 relative flex justify-center items-center">
              <div className="relative max-w-120 w-full overflow-hidden">
                <img src="/tv.png" alt="TV frame" className="w-full relative z-20" />
                <video
                  className="absolute top-[20.5%] left-[13%] w-[73.5%] h-[54.5%] z-10 object-cover"
                  playsInline
                  autoPlay
                  muted
                  loop
                >
                  <source src="/tv-video.m4v" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="bg-black">
          <Footer />
        </div>
      </div>
    );
  }

  // 2. Main Dashboard Page for Logged In Users
  return (
    <div className="relative min-h-screen bg-[#141414] pb-24 text-white flex flex-col">
      <Navbar />

      {/* Hero Banner Section */}
      {loadingTrending ? (
        <div className="h-[50vh] sm:h-[65vh] md:h-[80vh] w-full bg-zinc-900 animate-pulse flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-red-600"></span>
        </div>
      ) : trending ? (
        <div
          className="relative h-[55vh] sm:h-[70vh] md:h-[85vh] w-full bg-cover bg-center flex items-end pb-8 md:pb-24 px-4 md:px-12"
          style={{
            backgroundImage: `linear-gradient(to top, #141414 0%, rgba(20,20,20,0.4) 50%, rgba(20,20,20,0.8) 100%), url('https://image.tmdb.org/t/p/original${trending.backdrop_path || trending.poster_path}')`,
          }}
        >
          <div className="max-w-2xl z-10 flex flex-col gap-2 md:gap-4">
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-extrabold drop-shadow-md leading-tight text-white">
              {trending.title || trending.name}
            </h1>
            <p className="text-[10px] sm:text-xs md:text-sm text-zinc-400 drop-shadow-sm">
              {trending.release_date?.split('-')[0] || trending.first_air_date?.split('-')[0]} |{' '}
              {trending.adult ? '18+' : 'PG-13'}
            </p>
            <p className="text-xs sm:text-sm md:text-lg text-zinc-300 drop-shadow-sm line-clamp-2 md:line-clamp-4">
              {trending.overview}
            </p>

            <div className="flex flex-wrap gap-3 mt-2">
              <Link
                to={`/watch/${trending.id}`}
                className="btn btn-sm sm:btn-md bg-white text-black hover:bg-white/80 border-none font-bold flex items-center gap-2"
              >
                <FaPlay size={14} /> Play
              </Link>
              <Link
                to={`/watch/${trending.id}`}
                className="btn btn-sm sm:btn-md bg-zinc-600/70 text-white hover:bg-zinc-600/50 border-none font-bold flex items-center gap-2"
              >
                <FaInfoCircle size={14} /> More Info
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[50vh] sm:h-[65vh] md:h-[80vh] w-full bg-zinc-900 flex items-center justify-center text-gray-500">
          Failed to load trending banner.
        </div>
      )}

      {/* Content Sliders Section */}
      <div className="relative z-20 -mt-8 md:-mt-16 flex flex-col gap-2">
        {contentType === 'movie' ? (
          <>
            <MovieSlider title="Now Playing" category="now_playing" />
            <MovieSlider title="Popular Movies" category="popular" />
            <MovieSlider title="Top Rated" category="top_rated" />
            <MovieSlider title="Upcoming" category="upcoming" />
          </>
        ) : (
          <>
            <MovieSlider title="Airing Today" category="airing_today" />
            <MovieSlider title="On The Air" category="on_the_air" />
            <MovieSlider title="Popular TV Shows" category="popular" />
            <MovieSlider title="Top Rated TV" category="top_rated" />
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
