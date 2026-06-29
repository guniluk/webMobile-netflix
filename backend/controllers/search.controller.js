import User from '../models/user.model.js';
import { fetchFromTMDB } from '../services/tmdb.service.js';

export const searchPerson = async (req, res, next) => {
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/person?query=${req.params.query}&include_adult=false&language=en-US&page=1`,
    );
    if (data.results.length === 0)
      return res
        .status(404)
        .json({ success: false, message: 'No results found' });

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
    res.status(200).json({ success: true, content: data.results });
  } catch (error) {
    next(error);
  }
};

export const searchMovie = async (req, res, next) => {
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/movie?query=${req.params.query}&include_adult=false&language=en-US&page=1`,
    );
    if (data.results.length === 0)
      return res
        .status(404)
        .json({ success: false, message: 'No results found' });

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
    res.status(200).json({ success: true, content: data.results });
  } catch (error) {
    next(error);
  }
};

export const searchTv = async (req, res, next) => {
  try {
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/tv?query=${req.params.query}&include_adult=false&language=en-US&page=1`,
    );
    if (data.results.length === 0)
      return res
        .status(404)
        .json({ success: false, message: 'No results found' });

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
    res.status(200).json({ success: true, content: data.results });
  } catch (error) {
    next(error);
  }
};

export const getSearchHistory = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, content: req.user.searchHistory });
  } catch (error) {
    next(error);
  }
};

export const deleteSearchHistory = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { searchHistory: { id: parseInt(req.params.id) } },
    });
    res
      .status(200)
      .json({ success: true, message: 'Search history deleted successfully' });
  } catch (error) {
    next(error);
  }
};
