import { fetchFromTMDB } from '../services/tmdb.service.js';

export const getTrendingTv = async (req, res, next) => {
  try {
    const data = await fetchFromTMDB(
      'https://api.themoviedb.org/3/trending/tv/day?language=en-US',
    );
    res
      .status(200)
      .json({
        success: true,
        content: data.results[Math.floor(Math.random() * data.results?.length)],
      });
  } catch (error) {
    next(error);
  }
};

export const getTvTrailers = async (req, res, next) => {
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${req.params.id}/videos?language=en-US`,
    );
    res.status(200).json({ success: true, trailers: data.results });
  } catch (error) {
    next(error);
  }
};

export const getTvDetails = async (req, res, next) => {
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${req.params.id}?language=en-US`,
    );
    res.status(200).json({ success: true, content: data });
  } catch (error) {
    next(error);
  }
};

export const getTvSimilar = async (req, res, next) => {
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${req.params.id}/similar?language=en-US&page=1`,
    );
    res.status(200).json({ success: true, similar: data.results });
  } catch (error) {
    next(error);
  }
};

export const getTvByCategory = async (req, res, next) => {
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${req.params.category}?language=en-US&page=1`,
    );
    res.status(200).json({ success: true, content: data.results });
  } catch (error) {
    next(error);
  }
};
