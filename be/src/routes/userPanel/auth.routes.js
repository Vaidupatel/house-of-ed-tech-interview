import express from 'express';
const routes = express.Router();

import * as authController from '../../controllers/user/auth.controller.js';
import userAuth from "../../middleware/userAuth.js"


routes.post('/signup', authController.registerUser);
routes.post('/login', authController.loginUser);
routes.post('/logout', authController.logoutUser);
routes.get('/get', userAuth, authController.getUserProfile)
export default routes;
