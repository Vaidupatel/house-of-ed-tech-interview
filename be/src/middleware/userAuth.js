import jwt from 'jsonwebtoken';
import Validator from 'validatorjs';

import config from '../config/config.js';
import User from '../models/user.model.js';
import UserSession from '../models/userSession.model.js';
import { errorResponse } from '../helpers/response.js';


const userAuth = async (req, res, next) => {
  try {

    const validation = new Validator(req.headers, {
      authorization: 'required',
    });

    if (validation.fails()) {
      const firstMessage = validation.errors.first(
        Object.keys(validation.errors.all())[0]
      );
      return errorResponse(res, 9998, firstMessage, 401);
    }

    const { authorization } = req.headers;
    let decoded;


    try {
      decoded = jwt.verify(authorization, config.jwt.secret);
    } catch (error) {
      return errorResponse(res, 9001, 'Invalid or expired token', 401);
    }


    const session = await UserSession.findOne({ session_token: authorization });
    if (!session) {
      return errorResponse(res, 9001, 'Session not found or expired', 401);
    }


    const user = await User.findById(session.user_id);
    if (!user) {
      return errorResponse(res, 1003, 'User does not exist', 401);
    }

    if (!user.is_active) {
      return errorResponse(res, 9004, 'User account is inactive', 401);
    }


    req.user = user;

    next();
  } catch (error) {
    console.error('User auth middleware error:', error);
    return errorResponse(res, 9999, error, 500);
  }
};

export default userAuth;
