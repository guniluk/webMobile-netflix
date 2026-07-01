import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.route.js';
import protectRoute from './middleware/protectRoute.js';
import movieRoutes from './routes/movie.route.js';
import tvRoutes from './routes/tv.route.js';
import searchRoutes from './routes/search.route.js';
import { errorHandler } from './middleware/error.middleware.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve(); //! for production

app.use(express.json()); // to parse json data
app.use(express.urlencoded({ extended: true })); // to parse url-encoded data
app.use(cookieParser()); // to parse cookies
app.use(cors()); // to allow cross-origin requests
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/movie', protectRoute, movieRoutes);
app.use('/api/v1/tv', protectRoute, tvRoutes);
app.use('/api/v1/search', protectRoute, searchRoutes);

app.use(errorHandler); // error handling middleware

//! for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html')),
  );
}

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
