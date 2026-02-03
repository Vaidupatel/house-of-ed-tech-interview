import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Validator from 'validatorjs';

import config from '../../config/config.js';
import { errorResponse, successResponse } from '../../helpers/response.js';
import User from '../../models/user.model.js';
import UserSession from '../../models/userSession.model.js';


export const registerUser = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

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

        const exists = await User.findOne({ email }).session(session);
        if (exists) {
            await session.abortTransaction();
            session.endSession();
            return errorResponse(res, 1005); // email exists
        }

        const user = new User({
            name,
            email,
            password,
        });

        await user.save({ session });

        await session.commitTransaction();
        session.endSession();

        return successResponse(res, 1002, {
            id: user._id,
            name: user.name,
            email: user.email,
            api_key: user.api_key,
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return errorResponse(res, 9999, error);
    }
};


export const loginUser = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

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

        const user = await User.findOne({ email }).select('+password').session(session);
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return errorResponse(res, 1003);
        }

        if (!(await user.comparePassword(password))) {
            await session.abortTransaction();
            session.endSession();
            return errorResponse(res, 1004);
        }

        if (!user.is_active) {
            await session.abortTransaction();
            session.endSession();
            return errorResponse(res, 9004);
        }

        const token = jwt.sign(
            {
                user_id: user._id,
            },
            config.jwt.secret,
            { expiresIn: config.jwt.accessTokenExpireTime }
        );

        await UserSession.create(
            [
                {
                    user_id: user._id,
                    session_token: token,
                    ip_address: req.ip,
                    user_agent: req.headers['user-agent'],
                    expires_at: new Date(Date.now() + config.jwt.sessionTTL),
                },
            ],
            { session }
        );

        user.last_login_at = new Date();
        await user.save({ session });

        await session.commitTransaction();
        session.endSession();

        return successResponse(res, 1001, {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return errorResponse(res, 9999, error);
    }
};


export const logoutUser = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const token = req.headers.authorization;
        await UserSession.deleteOne({ session_token: token }).session(session);

        await session.commitTransaction();
        session.endSession();

        return successResponse(res, 1007);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return errorResponse(res, 9999, error);
    }
};


export const getUserProfile = async (req, res) => {
    return successResponse(res, 1006, {
        user: req.user,
    });
};
