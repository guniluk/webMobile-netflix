import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaChevronCircleLeft, FaExternalLinkAlt, FaGoogle, FaWikipediaW } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PersonProfile() {
  const { name } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const passedImageUrl = location.state?.imageUrl;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`/api/v1/search/person/profile/${encodeURIComponent(name)}`);
        if (res.data.success) {
          setProfile(res.data.profile);
        }
      } catch (err) {
        setError('Failed to load profile from search.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [name]);

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

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4 text-center">
          <h2 className="text-3xl font-bold text-zinc-400">{error || 'Profile not found.'}</h2>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-error bg-red-600 hover:bg-red-700 text-white font-bold"
          >
            Go Back
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col pb-20">
      <Navbar />

      <main className="flex-1 pt-24 max-w-4xl mx-auto w-full px-4 sm:px-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost hover:bg-zinc-900 text-gray-300 hover:text-white mb-6 flex items-center gap-2"
        >
          <FaChevronCircleLeft size={20} /> Back
        </button>

        {/* Profile Card Section */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl backdrop-blur-sm flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Profile Image */}
          <div className="shrink-0">
            {passedImageUrl || profile.imageUrl ? (
              <img
                src={passedImageUrl || profile.imageUrl}
                alt={profile.name}
                className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover border-4 border-zinc-800 shadow-2xl"
              />
            ) : (
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-zinc-800 border-4 border-zinc-700 flex items-center justify-center shadow-2xl">
                <span className="text-zinc-500 font-bold text-lg">No Image</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col gap-4 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
                {profile.name}
              </h1>
              <a
                href={profile.googleSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm border-zinc-700 hover:bg-zinc-800 hover:border-zinc-500 text-zinc-300 font-semibold self-center md:self-start flex items-center gap-2"
              >
                <FaGoogle size={14} className="text-red-500" /> Search on Google
              </a>
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">{profile.abstract}</p>

            <div className="mt-2 flex items-center justify-center md:justify-start gap-2 text-zinc-400 text-xs">
              <span>Source:</span>
              <a
                href={profile.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-500 hover:underline flex items-center gap-1 font-semibold"
              >
                <FaWikipediaW size={12} /> {profile.source} <FaExternalLinkAlt size={10} />
              </a>
            </div>
          </div>
        </div>

        {/* Related Search Links Section */}
        {profile.relatedLinks && profile.relatedLinks.length > 0 && (
          <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-white flex items-center gap-2">
              <FaGoogle className="text-blue-500" /> Google Search Results
            </h2>

            <div className="flex flex-col gap-6">
              {profile.relatedLinks.map((link, idx) => (
                <div
                  key={idx}
                  className="border-b border-zinc-800/60 pb-5 last:border-b-0 last:pb-0"
                >
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline text-lg font-bold block mb-1 hover:text-blue-300 transition-colors"
                  >
                    {link.title}
                  </a>
                  <span className="text-emerald-500 text-xs block mb-1 truncate max-w-full">
                    {link.url}
                  </span>
                  <p className="text-zinc-400 text-sm leading-relaxed">{link.snippet}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
