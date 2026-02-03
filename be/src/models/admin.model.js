import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import config from '../config/config.js';

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    is_active: {
      type: Boolean,
      default: true,
    },

    last_login_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

adminSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  try {
    const salt = await bcrypt.genSalt(config.bcrypt.salt);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw err;
  }
});

adminSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

const Admin =
  mongoose.models.Admin || mongoose.model('Admin', adminSchema);

export default Admin;
