import mongoose from 'mongoose';

const userSessionSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        session_token: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        ip_address: {
            type: String,
        },

        user_agent: {
            type: String,
        },

        expires_at: {
            type: Date,
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);


const UserSession =
    mongoose.models.UserSession ||
    mongoose.model('UserSession', userSessionSchema);

export default UserSession;
