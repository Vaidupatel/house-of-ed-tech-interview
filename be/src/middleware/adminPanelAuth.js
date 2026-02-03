import Validator from 'validatorjs';
import jwt from 'jsonwebtoken';

import config from '../config/config.js';
import Admin from '../models/admin.model.js';
import AdminSession from '../models/admin_sessions.model.js';
import { errorResponse } from '../helpers/response.js';

const adminPanelAuth = async (req, res, next) => {
  try {
    const validation = new Validator(req.headers, {
      authorization: 'required',
    });

    if (validation.fails()) {
      return errorResponse(res, 9001);
    }

    const token = req.headers.authorization;

    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.secret);
    } catch (error) {
      return errorResponse(res, 9001, '', 401);
    }

    const session = await AdminSession.findOne({
      session_token: token,
    });

    if (!session) {
      return errorResponse(res, 9001, '', 401);
    }

    const admin = await Admin.findById(session.admin_id);

    if (!admin) {
      return errorResponse(res, 1003, '', 401);
    }

    if (admin.is_account_deleted) {
      return errorResponse(res, 9002, '', 401);
    }

    if (!admin.is_active) {
      return errorResponse(res, 9004, '', 401);
    }


    req.admin = admin;
    req.session = session;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    return errorResponse(res, 9001, error, 401);
  }
};

export { adminPanelAuth };
