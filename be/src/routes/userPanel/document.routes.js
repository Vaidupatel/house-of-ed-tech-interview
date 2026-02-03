import express from 'express';
const routes = express.Router();

import * as documentController from '../../controllers/user/document.controller.js';
import userAuth from "../../middleware/userAuth.js"


routes.post('/add', userAuth, documentController.createDocument);
routes.get('/get', userAuth, documentController.listDocuments);

export default routes;
