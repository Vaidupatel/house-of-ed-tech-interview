import express from 'express';

import { adminPanelAuth } from "../../middleware/adminPanelAuth.js"
const routes = express.Router();

import * as authController from '../../controllers/adminpanel/auth.controller.js';

routes.post('/signup', authController.registerAdmin);
routes.post('/login', authController.loginAdmin);
routes.post('/logout', authController.logoutAdmin);
routes.get('/get', adminPanelAuth, authController.getAdminProfile);

export default routes;
