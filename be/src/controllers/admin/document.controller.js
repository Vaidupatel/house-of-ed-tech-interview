import mongoose from 'mongoose';

import { errorResponse, successResponse } from '../../helpers/response.js';
import Document from '../../models/document.model.js';

export const listDocuments = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const documents = await Document.aggregate([
            {
                $lookup: {
                    from: 'apikeys',
                    localField: '_id',
                    foreignField: 'document_id',
                    as: 'api_key_data',
                },
            },
            {
                $unwind: {
                    path: '$api_key_data',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user_data',
                },
            },
            {
                $unwind: {
                    path: '$user_data',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 0,
                    document_id: '$_id',
                    title: 1,
                    description: 1,
                    chunks_count: 1,
                    embedding_status: 1,
                    error_message: 1,

                    api_key: '$api_key_data.api_key',
                    allowed_origin: '$api_key_data.allowed_origin',
                    usage_count: { $ifNull: ['$api_key_data.usage_count', 0] },
                    last_used_at: '$api_key_data.last_used_at',

                    user: {
                        user_id: '$user_data._id',
                        name: '$user_data.name',
                        email: '$user_data.email',
                        is_active: '$user_data.is_active',
                        last_login_at: '$user_data.last_login_at',
                        created_at: '$user_data.createdAt',
                        updated_at: '$user_data.updatedAt',
                    },

                    created_at: '$createdAt',
                    updated_at: '$updatedAt',
                },
            },
            {
                $sort: { created_at: -1 },
            },
        ]).session(session);

        await session.commitTransaction();
        session.endSession();

        return successResponse(res, 1104, { documents });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return errorResponse(res, 9999, error);
    }
};
