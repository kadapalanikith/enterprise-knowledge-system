'use strict';

// Mock config so no .env file is needed in test environment
jest.mock('../src/config', () => ({
  mongoUri: 'mongodb://localhost:27017/test',
  port: 8000,
}));

const mongoose = require('mongoose');
const { User, ROLES } = require('../src/models/user');
const { Document } = require('../src/models/document');
const { AuditLog } = require('../src/models/auditLog');

describe('User model', () => {
  it('exports ROLES array with viewer, editor, admin', () => {
    expect(ROLES).toEqual(expect.arrayContaining(['viewer', 'editor', 'admin']));
    expect(ROLES).toHaveLength(3);
  });

  it('validates a valid user document', async () => {
    const user = new User({
      email: 'alice@example.com',
      hashedPassword: 'hashed123',
      role: 'viewer',
    });
    const err = user.validateSync();
    expect(err).toBeUndefined();
  });

  it('fails validation when email is missing', () => {
    const user = new User({ hashedPassword: 'hashed123' });
    const err = user.validateSync();
    expect(err.errors.email).toBeDefined();
  });

  it('fails validation when hashedPassword is missing', () => {
    const user = new User({ email: 'test@example.com' });
    const err = user.validateSync();
    expect(err.errors.hashedPassword).toBeDefined();
  });

  it('defaults role to viewer', () => {
    const user = new User({ email: 'a@b.com', hashedPassword: 'x' });
    expect(user.role).toBe('viewer');
  });

  it('defaults isActive to true', () => {
    const user = new User({ email: 'a@b.com', hashedPassword: 'x' });
    expect(user.isActive).toBe(true);
  });

  it('rejects invalid role value', () => {
    const user = new User({ email: 'a@b.com', hashedPassword: 'x', role: 'superuser' });
    const err = user.validateSync();
    expect(err.errors.role).toBeDefined();
  });
});

describe('Document model', () => {
  it('validates a valid document', async () => {
    const doc = new Document({
      title: 'Test Doc',
      content: 'Hello',
      ownerId: new mongoose.Types.ObjectId(),
      allowedRoles: ['viewer', 'editor'],
    });
    const err = doc.validateSync();
    expect(err).toBeUndefined();
  });

  it('fails validation when title is missing', () => {
    const doc = new Document({ ownerId: new mongoose.Types.ObjectId() });
    const err = doc.validateSync();
    expect(err.errors.title).toBeDefined();
  });

  it('fails validation when ownerId is missing', () => {
    const doc = new Document({ title: 'No Owner' });
    const err = doc.validateSync();
    expect(err.errors.ownerId).toBeDefined();
  });

  it('defaults allowedRoles to [viewer]', () => {
    const doc = new Document({ title: 'T', ownerId: new mongoose.Types.ObjectId() });
    expect(doc.allowedRoles).toEqual(['viewer']);
  });

  it('defaults tags to empty array', () => {
    const doc = new Document({ title: 'T', ownerId: new mongoose.Types.ObjectId() });
    expect(doc.tags).toEqual([]);
  });
});

describe('AuditLog model', () => {
  it('validates a valid audit log entry', () => {
    const log = new AuditLog({
      userId: new mongoose.Types.ObjectId(),
      action: 'READ',
      resourceType: 'document',
    });
    const err = log.validateSync();
    expect(err).toBeUndefined();
  });

  it('fails validation when userId is missing', () => {
    const log = new AuditLog({ action: 'READ', resourceType: 'document' });
    const err = log.validateSync();
    expect(err.errors.userId).toBeDefined();
  });

  it('fails validation when action is missing', () => {
    const log = new AuditLog({ userId: new mongoose.Types.ObjectId(), resourceType: 'document' });
    const err = log.validateSync();
    expect(err.errors.action).toBeDefined();
  });

  it('fails validation when resourceType is missing', () => {
    const log = new AuditLog({ userId: new mongoose.Types.ObjectId(), action: 'READ' });
    const err = log.validateSync();
    expect(err.errors.resourceType).toBeDefined();
  });

  it('defaults metadata to empty object', () => {
    const log = new AuditLog({
      userId: new mongoose.Types.ObjectId(),
      action: 'READ',
      resourceType: 'document',
    });
    expect(log.metadata).toEqual({});
  });
});
