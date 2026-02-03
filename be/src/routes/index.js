import express from 'express';
const routes = express.Router();

import adminRoutes from './adminPanel/index.js';
routes.use('/admin', adminRoutes);

import userRoutes from './userPanel/index.js';
routes.use('/user', userRoutes);

export default routes;
