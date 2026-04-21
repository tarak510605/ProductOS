const { getRedisClient, isRedisReady } = require('../config/redis');

const getCache = async (key) => {
  if (!isRedisReady()) {
    return null;
  }

  return getRedisClient().get(key);
};

const setCache = async (key, value, ttlSeconds = 120) => {
  if (!isRedisReady()) {
    return;
  }

  await getRedisClient().set(key, JSON.stringify(value), 'EX', ttlSeconds);
};

const deleteCacheByPattern = async (pattern) => {
  if (!isRedisReady()) {
    return;
  }

  const client = getRedisClient();
  let cursor = '0';

  do {
    const [nextCursor, keys] = await client.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
    cursor = nextCursor;

    if (keys.length > 0) {
      await client.del(...keys);
    }
  } while (cursor !== '0');
};

module.exports = {
  getCache,
  setCache,
  deleteCacheByPattern
};
