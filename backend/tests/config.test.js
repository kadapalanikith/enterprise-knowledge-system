'use strict';

// Prevent dotenv from reading the real .env file during config tests
jest.mock('dotenv', () => ({ config: jest.fn() }));

describe('config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    // Isolate env — strip any MONGO_URI/PORT that leaked from .env or other tests
    process.env = { ...originalEnv };
    delete process.env.MONGO_URI;
    delete process.env.PORT;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('throws when MONGO_URI is missing', () => {
    expect(() => require('../src/config')).toThrow(
      'Missing required environment variable: MONGO_URI'
    );
  });

  it('exports mongoUri when MONGO_URI is set', () => {
    process.env.MONGO_URI = 'mongodb://localhost:27017/test';
    const { mongoUri } = require('../src/config');
    expect(mongoUri).toBe('mongodb://localhost:27017/test');
  });

  it('defaults port to 8000 when PORT is not set', () => {
    process.env.MONGO_URI = 'mongodb://localhost:27017/test';
    const { port } = require('../src/config');
    expect(port).toBe(8000);
  });

  it('reads PORT from environment when set', () => {
    process.env.MONGO_URI = 'mongodb://localhost:27017/test';
    process.env.PORT = '3000';
    const { port } = require('../src/config');
    expect(port).toBe(3000);
  });
});
