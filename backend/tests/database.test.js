'use strict';

// Mock config before requiring database
jest.mock('../src/config', () => ({
  mongoUri: 'mongodb://localhost:27017/test',
  port: 8000,
}));

// Mock mongoose so we never hit a real DB
jest.mock('mongoose', () => {
  const actual = jest.requireActual('mongoose');
  return {
    ...actual,
    connect: jest.fn(),
    disconnect: jest.fn(),
  };
});

const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../src/database');

describe('database', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('connectDB calls mongoose.connect with the correct URI', async () => {
    mongoose.connect.mockResolvedValueOnce(undefined);
    await connectDB();
    expect(mongoose.connect).toHaveBeenCalledWith(
      'mongodb://localhost:27017/test',
      expect.objectContaining({ dbName: 'enterprise_knowledge_system' })
    );
  });

  it('connectDB rejects when mongoose.connect throws', async () => {
    mongoose.connect.mockRejectedValueOnce(new Error('Connection refused'));
    await expect(connectDB()).rejects.toThrow('Connection refused');
  });

  it('disconnectDB calls mongoose.disconnect', async () => {
    mongoose.disconnect.mockResolvedValueOnce(undefined);
    await disconnectDB();
    expect(mongoose.disconnect).toHaveBeenCalled();
  });
});
