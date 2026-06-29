import { fetchFromTMDB } from '../services/tmdb.service.js';

export const getTrendingMovie = async (req, res) => {
  try {
    const url = `https://api.themoviedb.org/3/trending/movie/day?language=en-US`;
    const data = await fetchFromTMDB(url);
    const randomMovie =
      data.results[Math.floor(Math.random() * data.results?.length)];
    res.status(200).json({
      succcess: true,
      content: randomMovie,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      succcess: false,
      message: 'Internal server error',
    });
  }
};

export const getMovieTrailers = async (req, res) => {
  try {
    const { id } = req.params;
    const url = `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`;
    const data = await fetchFromTMDB(url);
    const trailers = data.results.filter(
      (video) => video.type === 'Trailer' && video.site === 'YouTube',
    );
    res.status(200).json({
      succcess: true,
      trailers,
    });
  } catch (error) {
    if (error.message.includes('404')) {
      return res.status(404).json({
        succcess: false,
        message: 'Movie not found',
      });
    }
    console.log(error.message);
    res.status(500).json({
      succcess: false,
      message: 'Internal server error',
    });
  }
};

export const getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`;
    const data = await fetchFromTMDB(url);
    res.status(200).json({
      succcess: true,
      content: data,
    });
  } catch (error) {
    if (error.message.includes('404')) {
      return res.status(404).json({
        succcess: false,
        message: 'Movie not found',
      });
    }
    console.log(error.message);
    res.status(500).json({
      succcess: false,
      message: 'Internal server error',
    });
  }
};

export const getMovieSimilar = async (req, res) => {
  try {
    const { id } = req.params;
    const url = `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`;
    const data = await fetchFromTMDB(url);
    res.status(200).json({
      succcess: true,
      similar: data.results,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      succcess: false,
      message: 'Internal server error',
    });
  }
};

export const getMovieByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const url = `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1 `;
    const data = await fetchFromTMDB(url);
    res.status(200).json({
      succcess: true,
      content: data.results,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      succcess: false,
      message: 'Internal server error',
    });
  }
};
