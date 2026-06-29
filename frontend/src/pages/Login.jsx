import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoggingIn } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.8) 0, rgba(0, 0, 0, 0.4) 60%, rgba(0, 0, 0, 0.8) 100%), url('https://assets.nflxext.com/ffe/siteui/vlv3/435e8bb8-7f1b-49cb-8da8-bff997124294/web/US-en-20260511-TRIFECTA-perspective_faa2ba65-d9fe-44bc-b4e0-f702a991adaa_large.jpg')`,
      }}
    >
      {/* Header Logo */}
      <div className="absolute top-4 left-4 md:top-8 md:left-12">
        <Link to="/" className="text-red-600 font-extrabold text-3xl md:text-4xl tracking-wider">
          BYH Videos
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-black/75 p-8 md:p-12 rounded-lg border border-zinc-800 mx-4 shadow-2xl backdrop-blur-sm">
        <h2 className="text-white text-3xl font-bold mb-8">Sign In</h2>

        {error && (
          <div className="bg-red-600/20 border border-red-600 text-red-200 text-sm p-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="form-control">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input input-bordered w-full bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-red-600"
            />
          </div>

          <div className="form-control">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input input-bordered w-full bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-red-600"
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="btn btn-error w-full font-bold text-white bg-red-600 border-none hover:bg-red-700 disabled:bg-zinc-700"
          >
            {isLoggingIn ? <span className="loading loading-spinner loading-sm"></span> : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-zinc-400 text-sm">
          New to Netflix?{' '}
          <Link to="/signup" className="text-white hover:underline font-semibold">
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
}
