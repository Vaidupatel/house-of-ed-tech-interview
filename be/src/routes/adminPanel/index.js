import express from 'express';
const routes = express.Router();

import authRoutes from './auth.routes.js';
routes.use('/auth', authRoutes);

import userRoutes from './user.routes.js';
routes.use('/user', userRoutes);


export default routes;
