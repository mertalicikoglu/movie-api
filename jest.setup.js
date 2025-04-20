// Mock Redis for tests
jest.mock('ioredis', () => {
  const Redis = jest.fn().mockImplementation(() => {
    return {
      on: jest.fn(),
      set: jest.fn().mockResolvedValue('OK'),
      setex: jest.fn().mockResolvedValue('OK'),
      get: jest.fn().mockResolvedValue(null),
      del: jest.fn().mockResolvedValue(1),
      keys: jest.fn().mockResolvedValue([]),
      flushall: jest.fn().mockResolvedValue('OK'),
    };
  });
  return Redis;
}); 