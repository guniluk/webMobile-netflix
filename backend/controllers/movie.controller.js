import { fetchFromTMDB } from '../services/tmdb.service.js';

export const getTrendingMovie = async (req, res, next) => {
  try {
    const data = await fetchFromTMDB(
      'https://api.themoviedb.org/3/trending/movie/day?language=en-US'
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
    const { id } = req.params;
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`
    );
    res.status(200).json({
      success: true,
      trailers: data.results.filter((v) => v.type === 'Trailer' && v.site === 'YouTube'),
    });
  } catch (error) {
    next(error);
  }
};

export const getMovieDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}?language=en-US`);
    res.status(200).json({ success: true, content: data });
  } catch (error) {
    next(error);
  }
};

export const getMovieSimilar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`
    );
    res.status(200).json({ success: true, similar: data.results });
  } catch (error) {
    next(error);
  }
};

export const getMovieByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`
    );
    res.status(200).json({ success: true, content: data.results });
  } catch (error) {
    next(error);
  }
};
