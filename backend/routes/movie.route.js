import express from 'express';
const route = express.Router();

import {
  getTrendingMovie,
  getMovieTrailers,
  getMovieDetails,
  getMovieSimilar,
  getMovieByCategory,
} from '../controllers/movie.controller.js';

route.get('/trending', getTrendingMovie);
route.get('/:id/trailers', getMovieTrailers);
route.get('/:id/details', getMovieDetails);
route.get('/:id/similar', getMovieSimilar);
route.get('/:category', getMovieByCategory);

export default route;
