import mongoose from 'mongoose';
import crypto from 'crypto';

const apiKeySchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
            index: true,
        },

        document_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Document',
            required: true,
            unique: true,
        },

        api_key: {
            type: String,
            required: true,
            unique: true,
            default: () => crypto.randomBytes(32).toString('hex'),
            index: true,
        },

        allowed_origin: {
            type: String,
            required: true,
            trim: true,
        },

        usage_count: {
            type: Number,
            default: 0,
        },

        last_used_at: {
            type: Date,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const ApiKey =
    mongoose.models.ApiKey || mongoose.model('ApiKey', apiKeySchema);

export default ApiKey;
