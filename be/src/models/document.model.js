import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
            index: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150,
        },

        description: {
            type: String,
            trim: true,
            maxlength: 500,
        },

        original_text: {
            type: String,
            required: true,
        },

        chunks_count: {
            type: Number,
            default: 0,
        },

        embedding_status: {
            type: String,
            enum: ['pending', 'processing', 'completed', 'failed'],
            default: 'pending',
            index: true,
        },

        error_message: {
            type: String,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Document =
    mongoose.models.Document || mongoose.model('Document', documentSchema);

export default Document;
