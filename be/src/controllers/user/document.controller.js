import mongoose from 'mongoose';
import Validator from 'validatorjs';

import { errorResponse, successResponse } from '../../helpers/response.js';
import ApiKey from '../../models/apiKey.model.js';
import Document from '../../models/document.model.js';

import config from '../../config/config.js';
import qdrant from '../../config/qdrant.js';
import { chunkByParagraph } from '../../helpers/chunkText.js';
import { embedTexts } from '../../helpers/embedText.js';

export const createDocument = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const validation = new Validator(req.body, {
            title: 'required|string',
            text: 'string|min:50',
            allowed_origin: 'required|string',
        });

        if (validation.fails()) {
            const firstMessage = validation.errors.first(
                Object.keys(validation.errors.all())[0]
            );
            await session.abortTransaction();
            return errorResponse(res, 9998, firstMessage);
        }

        const userId = req.user._id;
        const { title, text, allowed_origin, description } = req.body;

        const existing = await Document.findOne({ user_id: userId }).session(session);
        if (existing) {
            await session.abortTransaction();
            return errorResponse(res, 1100);
        }

        let textData = ""

        if (req.files && req.files.length > 0) {
            if (req.files.length > 1) {
                await session.abortTransaction();
                return errorResponse(res, 1200);
            }

            const file = req.files[0];


            if (!file.buffer) {
                await session.abortTransaction();
                return errorResponse(res, 9998, "Invalid file upload");
            }


            if (file.mimetype && file.mimetype !== 'text/plain') {
                await session.abortTransaction();
                return errorResponse(res, 9998, "Only plain text files are supported");
            }

            textData = file.buffer.toString('utf-8').trim();
        } else if (text) {
            textData = text
        }

        if (!textData || textData.length < 50) {
            await session.abortTransaction();
            return errorResponse(res, 9998, "Uploaded text file content is too short");
        }

        const chunks = chunkByParagraph(textData);

        const { embeddings, dimensions } = await embedTexts(chunks);


        const collectionName = `${config.qdrant.collectionPrefix}_${userId}`;

        const collections = await qdrant.getCollections();

        const exists = collections.collections.find(c => c.name === collectionName);

        if (!exists) {
            await qdrant.createCollection(collectionName, {
                vectors: {
                    size: dimensions,
                    distance: 'Cosine',
                },
            });
        }


        await qdrant.upsert(collectionName, {
            points: embeddings.map((vector, i) => ({
                id: i + 1,
                vector,
                payload: {
                    text: chunks[i],
                    chunk_index: i,
                },
            })),
        });

        const document = await Document.create(
            [
                {
                    user_id: userId,
                    title,
                    description,
                    original_text: textData,
                    chunks_count: chunks.length,
                    embedding_status: 'completed',
                },
            ],
            { session }
        );

        const apiKey = await ApiKey.create(
            [
                {
                    user_id: userId,
                    document_id: document[0]._id,
                    allowed_origin,
                },
            ],
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        return successResponse(res, 1101, {
            document_id: document[0]._id,
            chunks: chunks.length,
            api_key: apiKey[0].api_key,
            allowed_origin,
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return errorResponse(res, 9999, error);
    }
};
export const listDocuments = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);

        const documents = await Document.aggregate([
            {
                $match: {
                    user_id: userId,
                },
            },
            {
                $lookup: {
                    from: 'apikeys', // Mongo collection name
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
                    usage_count: {
                        $ifNull: ['$api_key_data.usage_count', 0],
                    },
                    last_used_at: '$api_key_data.last_used_at',

                    created_at: '$createdAt',
                    updated_at: '$updatedAt',
                },
            },
            {
                $sort: {
                    created_at: -1,
                },
            },
        ]).session(session);

        await session.commitTransaction();
        session.endSession();

        return successResponse(res, 1104, {
            // total: documents.length,
            documents,
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return errorResponse(res, 9999, error);
    }
};