const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./config/swagger');
const routesV1 = require('./routes/v1');
const sanitizeInput = require('./middleware/sanitizeInput');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(helmet());
const configuredOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim())
  : true;

app.use(cors({ origin: configuredOrigins }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(sanitizeInput);
app.use(hpp());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, try again later'
  }
});

app.use('/api', apiLimiter);

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [System]
 *     summary: Health check endpoint
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *             examples:
 *               healthy:
 *                 value:
 *                   success: true
 *                   message: Server is healthy
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy'
  });
});

app.use('/api/v1', routesV1);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
