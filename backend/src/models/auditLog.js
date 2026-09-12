'use strict';

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
      trim: true,
    },
    resourceType: {
      type: String,
      required: [true, 'Resource type is required'],
      trim: true,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    // Audit logs are append-only; prevent accidental updates
    strict: true,
  }
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = { AuditLog };
