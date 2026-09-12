'use strict';

const mongoose = require('mongoose');
const { ROLES } = require('./user');

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner ID is required'],
    },
    allowedRoles: {
      type: [String],
      enum: { values: ROLES, message: 'Each role must be one of: viewer, editor, admin' },
      default: ['viewer'],
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Document = mongoose.model('Document', documentSchema);

module.exports = { Document };
