import express from 'express';
const routes = express.Router();

import authRoutes from './auth.routes.js';
routes.use('/auth', authRoutes);

import documentRoutes from './document.routes.js';
routes.use('/document', documentRoutes);

import queryRoutes from './query.routes.js';
routes.use('/query', queryRoutes);

export default routes;
