import { fetchFromTMDB } from '../services/tmdb.service.js';

export const getTrendingTv = async (req, res) => {
  try {
    const url = `https://api.themoviedb.org/3/trending/tv/day?language=en-US`;
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

export const getTvTrailers = async (req, res) => {
  try {
    const { id } = req.params;
    const url = `https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`;
    const data = await fetchFromTMDB(url);
    res.status(200).json({
      succcess: true,
      trailers: data.results,
    });
  } catch (error) {
    if (error.message.includes('404')) {
      return res.status(404).json({
        succcess: false,
        message: 'Tv not found',
      });
    }
    console.log(error.message);
    res.status(500).json({
      succcess: false,
      message: 'Internal server error',
    });
  }
};

export const getTvDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const url = `https://api.themoviedb.org/3/tv/${id}?language=en-US`;
    const data = await fetchFromTMDB(url);
    res.status(200).json({
      succcess: true,
      content: data,
    });
  } catch (error) {
    if (error.message.includes('404')) {
      return res.status(404).json({
        succcess: false,
        message: 'Tv not found',
      });
    }
    console.log(error.message);
    res.status(500).json({
      succcess: false,
      message: 'Internal server error',
    });
  }
};

export const getTvSimilar = async (req, res) => {
  try {
    const { id } = req.params;
    const url = `https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=1`;
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

export const getTvByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const url = `https://api.themoviedb.org/3/tv/${category}?language=en-US&page=1 `;
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
