import User from '../models/user.model.js';
import { fetchFromTMDB } from '../services/tmdb.service.js';

export const searchPerson = async (req, res) => {
  const { query } = req.params;
  try {
    const url = `https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`;
    const data = await fetchFromTMDB(url);
    if (data.results.length === 0)
      return res.status(404).json({
        succcess: false,
        message: 'No results found',
      });

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          id: data.results[0].id,
          image: data.results[0].profile_path,
          title: data.results[0].name,
          searchType: 'person',
          createdAt: new Date(),
        },
      },
    });

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

export const searchMovie = async (req, res) => {
  const { query } = req.params;
  try {
    const url = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`;

    const data = await fetchFromTMDB(url);
    if (data.results.length === 0)
      return res.status(404).json({
        succcess: false,
        message: 'No results found',
      });

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          id: data.results[0].id,
          image: data.results[0].poster_path,
          title: data.results[0].title,
          searchType: 'movie',
          createdAt: new Date(),
        },
      },
    });

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

export const searchTv = async (req, res) => {
  const { query } = req.params;
  try {
    const url = `https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`;

    const data = await fetchFromTMDB(url);
    if (data.results.length === 0)
      return res.status(404).json({
        succcess: false,
        message: 'No results found',
      });

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          id: data.results[0].id,
          image: data.results[0].poster_path,
          title: data.results[0].name,
          searchType: 'tv',
          createdAt: new Date(),
        },
      },
    });

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

export const getSearchHistory = async (req, res) => {
  try {
    res.status(200).json({
      succcess: true,
      content: req.user.searchHistory,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      succcess: false,
      message: 'Internal server error',
    });
  }
};

export const deleteSearchHistory = async (req, res) => {
  let { id } = req.params;
  id = parseInt(id);
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: {
        searchHistory: {
          id: id,
        },
      },
    });
    res.status(200).json({
      succcess: true,
      message: 'Search history deleted successfully',
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      succcess: false,
      message: 'Internal server error',
    });
  }
};
