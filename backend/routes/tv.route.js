import express from 'express';
const route = express.Router();

import {
  getTrendingTv,
  getTvTrailers,
  getTvDetails,
  getTvSimilar,
  getTvByCategory,
} from '../controllers/tv.controller.js';

route.get('/trending', getTrendingTv);
route.get('/:id/trailers', getTvTrailers);
route.get('/:id/details', getTvDetails);
route.get('/:id/similar', getTvSimilar);
route.get('/:category', getTvByCategory);

export default route;
