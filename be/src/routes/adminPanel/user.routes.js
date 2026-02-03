import express from 'express';
const routes = express.Router();

import * as documentController from '../../controllers/admin/document.controller.js';
import { adminPanelAuth } from "../../middleware/adminPanelAuth.js"

routes.get('/document/get', adminPanelAuth, documentController.listDocuments);

export default routes;
