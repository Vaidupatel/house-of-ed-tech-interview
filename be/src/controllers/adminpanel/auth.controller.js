import jwt from 'jsonwebtoken';
import Validator from 'validatorjs';

import config from '../../config/config.js';
import { errorResponse, successResponse } from '../../helpers/response.js';
import Admin from '../../models/admin.model.js';
import AdminSession from '../../models/admin_sessions.model.js';


export const registerAdmin = async (req, res) => {
  try {
    const validation = new Validator(req.body, {
      name: 'required|string',
      email: 'required|email',
      password: 'required|min:8',
    });

    if (validation.fails()) {
      const firstMessage = validation.errors.first(
        Object.keys(validation.errors.all())[0]
      );
      return errorResponse(res, 9998, firstMessage);
    }

    const { name, email, password } = req.body;

    const exists = await Admin.findOne({ email });
    if (exists) {
      return errorResponse(res, 1005);
    }

    const admin = new Admin({
      name,
      email,
      password
    });

    await admin.save();

    return successResponse(res, 1002);
  } catch (error) {
    return errorResponse(res, 9999, error);
  }
};


export const loginAdmin = async (req, res) => {
  try {
    const validation = new Validator(req.body, {
      email: 'required|email',
      password: 'required',
    });

    if (validation.fails()) {
      const firstMessage = validation.errors.first(
        Object.keys(validation.errors.all())[0]
      );
      return errorResponse(res, 9998, firstMessage);
    }

    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return errorResponse(res, 1003);
    }
    if (!(await admin.comparePassword(password))) {
      return errorResponse(res, 1004);
    }

    if (!admin.is_active) {
      return errorResponse(res, 9004);
    }

    const token = jwt.sign(
      {
        admin_id: admin._id,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.accessTokenExpireTime }
    );

    await AdminSession.create({
      admin_id: admin._id,
      session_token: token,
      ip_address: req.ip,
      user_agent: req.headers['user-agent'],
      expires_at: new Date(Date.now() + config.jwt.sessionTTL),
    });

    admin.last_login_at = new Date();
    await admin.save();

    return successResponse(res, 1001, {
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    return errorResponse(res, 9999, error);
  }
};

/**
 * LOGOUT ADMIN
 */
export const logoutAdmin = async (req, res) => {
  try {
    const token = req.headers.authorization;
    await AdminSession.deleteOne({ session_token: token });
    return successResponse(res, 'Logged out successfully');
  } catch (error) {
    return errorResponse(res, 9999, error);
  }
};

/**
 * GET PROFILE
 */
export const getAdminProfile = async (req, res) => {
  return successResponse(res, 'Profile fetched', {
    admin: req.admin,
  });
};
