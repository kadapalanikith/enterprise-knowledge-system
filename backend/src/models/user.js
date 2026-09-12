'use strict';

const mongoose = require('mongoose');

const ROLES = ['viewer', 'editor', 'admin'];

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    hashedPassword: {
      type: String,
      required: [true, 'Hashed password is required'],
    },
    role: {
      type: String,
      enum: { values: ROLES, message: 'Role must be one of: viewer, editor, admin' },
      default: 'viewer',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = { User, ROLES };
