const requiredEnvVars = ['PORT', 'MONGO_URI', 'JWT_SECRET', 'JWT_EXPIRES_IN', 'CLIENT_ORIGIN'];

const validateEnv = () => {
  const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  if (process.env.JWT_SECRET === 'replace_with_a_very_secure_secret') {
    throw new Error('JWT_SECRET must be replaced with a strong secret value');
  }
};

module.exports = validateEnv;
