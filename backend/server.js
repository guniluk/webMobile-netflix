import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.route.js';
import protectRoute from './middleware/protectRoute.js';
import movieRoutes from './routes/movie.route.js';
import tvRoutes from './routes/tv.route.js';
import searchRoutes from './routes/search.route.js';

import path from 'path'; //! for production
const __dirname = path.resolve(); //! for profuction

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

///middleware///
app.use(express.json()); //req.body
app.use(express.urlencoded({ extended: true })); //form data
app.use(cookieParser());
app.use(cors());

///route///
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/movie', protectRoute, movieRoutes);
app.use('/api/v1/tv', protectRoute, tvRoutes);
app.use('/api/v1/search', protectRoute, searchRoutes);

//! for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
  });
}
//! for production

///connect mongoDb and app run///
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
