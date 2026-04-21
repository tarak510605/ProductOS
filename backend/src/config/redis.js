const Redis = require('ioredis');

let redisClient = null;
let redisReady = false;

const connectRedis = () => {
  if (!process.env.REDIS_URL) {
    console.warn('REDIS_URL is not set, caching disabled');
    return null;
  }

  redisClient = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false
  });

  redisClient.on('ready', () => {
    redisReady = true;
    console.log('Redis connected');
  });

  redisClient.on('error', (error) => {
    redisReady = false;
    console.error('Redis connection error:', error.message);
  });

  redisClient.on('end', () => {
    redisReady = false;
    console.warn('Redis connection closed');
  });

  return redisClient;
};

const getRedisClient = () => redisClient;
const isRedisReady = () => redisReady;

module.exports = {
  connectRedis,
  getRedisClient,
  isRedisReady
};
