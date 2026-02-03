import mongoose from 'mongoose';

const adminSessionSchema = new mongoose.Schema(
  {
    admin_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
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

const AdminSession =
  mongoose.models.AdminSession ||
  mongoose.model('AdminSession', adminSessionSchema);

export default AdminSession;
