require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/db');
const validateEnv = require('./src/config/env');
const { connectRedis } = require('./src/config/redis');

const PORT = process.env.PORT;

const startServer = async () => {
  try {
    validateEnv();
    await connectDB();
    connectRedis();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
