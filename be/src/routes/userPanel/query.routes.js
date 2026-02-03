import express from 'express';
const routes = express.Router();

import * as queryController from '../../controllers/user/query.controller.js';
import apiKeyAuth from "../../middleware/apiKeyAuth.js"


routes.post('/ask', apiKeyAuth, queryController.queryDocument);

export default routes;
