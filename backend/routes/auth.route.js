import express from 'express';
const route = express.Router();

import {
  loginController,
  logoutController,
  signupController,
  authCheckController,
} from '../controllers/auth.controller.js';
import protectRoute from '../middleware/protectRoute.js';

route.post('/signup', signupController);

route.post('/login', loginController);

route.post('/logout', logoutController);

route.get('/authCheck', protectRoute, authCheckController);

export default route;
