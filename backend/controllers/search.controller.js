import axios from 'axios';
import User from '../models/user.model.js';
import { fetchFromTMDB } from '../services/tmdb.service.js';

export const searchPerson = async (req, res, next) => {
  try {
    const { query } = req.params;
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`
    );

    // Filter out items without profiles
    const filteredResults = (data.results || []).filter((item) => item.profile_path);

    if (filteredResults.length === 0)
      return res.status(404).json({ success: false, message: 'No results found' });

    // Remove existing duplicate first
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { searchHistory: { id: filteredResults[0].id, searchType: 'person' } },
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          id: filteredResults[0].id,
          image: filteredResults[0].profile_path,
          title: filteredResults[0].name,
          searchType: 'person',
          createdAt: new Date(),
        },
      },
    });
    res.status(200).json({ success: true, content: filteredResults });
  } catch (error) {
    next(error);
  }
};

export const searchMovie = async (req, res, next) => {
  try {
    const { query } = req.params;
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`
    );

    // Filter out items without posters
    const filteredResults = (data.results || []).filter(
      (item) => item.poster_path || item.backdrop_path
    );

    if (filteredResults.length === 0)
      return res.status(404).json({ success: false, message: 'No results found' });

    // Remove existing duplicate first
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { searchHistory: { id: filteredResults[0].id, searchType: 'movie' } },
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          id: filteredResults[0].id,
          image: filteredResults[0].poster_path || filteredResults[0].backdrop_path,
          title: filteredResults[0].title,
          searchType: 'movie',
          createdAt: new Date(),
        },
      },
    });
    res.status(200).json({ success: true, content: filteredResults });
  } catch (error) {
    next(error);
  }
};

export const searchTv = async (req, res, next) => {
  try {
    const { query } = req.params;
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`
    );

    // Filter out items without posters
    const filteredResults = (data.results || []).filter(
      (item) => item.poster_path || item.backdrop_path
    );

    if (filteredResults.length === 0)
      return res.status(404).json({ success: false, message: 'No results found' });

    // Remove existing duplicate first
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { searchHistory: { id: filteredResults[0].id, searchType: 'tv' } },
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          id: filteredResults[0].id,
          image: filteredResults[0].poster_path || filteredResults[0].backdrop_path,
          title: filteredResults[0].name,
          searchType: 'tv',
          createdAt: new Date(),
        },
      },
    });
    res.status(200).json({ success: true, content: filteredResults });
  } catch (error) {
    next(error);
  }
};

export const getPersonProfile = async (req, res, next) => {
  try {
    const { name } = req.params;
    const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(name)}&format=json&pretty=1`;
    const response = await axios.get(ddgUrl);
    const data = response.data;

    const profile = {
      name: data.Heading || name,
      abstract: data.AbstractText || 'No description available from search.',
      source: data.AbstractSource || 'Wikipedia',
      sourceUrl: data.AbstractURL || `https://en.wikipedia.org/wiki/${encodeURIComponent(name)}`,
      imageUrl: data.Image || null,
      relatedLinks: (data.RelatedTopics || [])
        .map((topic) => {
          if (topic.FirstURL && topic.Text) {
            return {
              title: topic.Text.split(' - ')[0] || topic.Text,
              url: topic.FirstURL,
              snippet: topic.Text,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(0, 5),
      googleSearchUrl: `https://www.google.com/search?q=${encodeURIComponent(name)}`,
    };

    res.status(200).json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};

export const getSearchHistory = async (req, res, next) => {
  try {
    const history = req.user.searchHistory || [];
    const seen = new Set();
    const uniqueHistory = [];

    // Filter duplicates keeping only the most recent entry
    for (let i = history.length - 1; i >= 0; i--) {
      const item = history[i];
      if (!item) continue;
      const key = `${item.searchType}-${item.id}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueHistory.push(item);
      }
    }

    // Reverse it back to maintain chronological order (oldest to newest)
    uniqueHistory.reverse();

    res.status(200).json({ success: true, content: uniqueHistory });
  } catch (error) {
    next(error);
  }
};

export const deleteSearchHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { searchHistory: { id: parseInt(id) } },
    });
    res.status(200).json({ success: true, message: 'Search history deleted successfully' });
  } catch (error) {
    next(error);
  }
};
