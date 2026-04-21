const { getCache, setCache } = require('../services/cacheService');

const cacheResponse = (keyBuilder, ttlSeconds = 120) => {
  return async (req, res, next) => {
    const key = keyBuilder(req);

    if (!key) {
      return next();
    }

    const cachedData = await getCache(key);

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const originalJson = res.json.bind(res);
    res.json = (payload) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        setCache(key, payload, ttlSeconds).catch(() => {});
      }

      return originalJson(payload);
    };

    return next();
  };
};

module.exports = cacheResponse;
