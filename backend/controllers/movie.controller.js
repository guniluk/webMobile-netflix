import { fetchFromTMDB } from '../services/tmdb.service.js';

export const getTrendingMovie = async (req, res, next) => {
  try {
    const data = await fetchFromTMDB(
      'https://api.themoviedb.org/3/trending/movie/day?language=en-US',
    );
    res.status(200).json({
      success: true,
      content: data.results[Math.floor(Math.random() * data.results?.length)],
    });
  } catch (error) {
    next(error);
  }
};

export const getMovieTrailers = async (req, res, next) => {
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${req.params.id}/videos?language=en-US`,
    );
    res.status(200).json({
      success: true,
      trailers: data.results.filter(
        (v) => v.type === 'Trailer' && v.site === 'YouTube',
      ),
    });
  } catch (error) {
    next(error);
  }
};

export const getMovieDetails = async (req, res, next) => {
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${req.params.id}?language=en-US`,
    );
    res.status(200).json({ success: true, content: data });
  } catch (error) {
    next(error);
  }
};

export const getMovieSimilar = async (req, res, next) => {
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${req.params.id}/similar?language=en-US&page=1`,
    );
    res.status(200).json({ success: true, similar: data.results });
  } catch (error) {
    next(error);
  }
};

export const getMovieByCategory = async (req, res, next) => {
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${req.params.category}?language=en-US&page=1`,
    );
    res.status(200).json({ success: true, content: data.results });
  } catch (error) {
    next(error);
  }
};
