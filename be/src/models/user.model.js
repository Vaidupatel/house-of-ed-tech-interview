import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

import config from '../config/config.js';


const userSchema = new mongoose.Schema(
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


userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(config.bcrypt.salt);
  this.password = await bcrypt.hash(this.password, salt);
});


userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
