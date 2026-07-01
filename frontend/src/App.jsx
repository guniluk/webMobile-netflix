import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Search from './pages/Search';
import WatchDetail from './pages/WatchDetail';
import PersonProfile from './pages/PersonProfile';

export default function App() {
  const { user, isCheckingAuth, authCheck } = useAuthStore();

  useEffect(() => {
    authCheck();
  }, [authCheck]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public or Home Page */}
        <Route path="/" element={<Home />} />

        {/* Redirect to home if user is logged in, else show auth page */}
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" replace />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />

        {/* Protect Route: Redirect to login if user is not logged in */}
        <Route
          path="/watch/:id"
          element={user ? <WatchDetail /> : <Navigate to="/login" replace />}
        />
        <Route path="/search" element={user ? <Search /> : <Navigate to="/login" replace />} />
        <Route
          path="/person/profile/:name"
          element={user ? <PersonProfile /> : <Navigate to="/login" replace />}
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
