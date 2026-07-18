import './config/env.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import mongoose from 'mongoose';

import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';

function checkRequiredEnvVars() {
  const requiredVars = ['MONGODB_URI', 'JWT_SECRET'];
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error(
      `Fatal Error: Missing required environment variables: ${missingVars.join(', ')}`
    );
    process.exit(1);
  }
}

const app = express();

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many auth attempts.' },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);

app.use(helmet());

const NODE_ENV = process.env.NODE_ENV || 'production';

if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use((req, res, next) => {
  if (req.query) {
    Object.defineProperty(req, 'query', {
      value: { ...req.query },
      writable: true,
      configurable: true,
      enumerable: true
    });
  }
  next();
});

app.use(mongoSanitize());

const devOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
  'http://127.0.0.1:3000'
];

const parsedEnvUrls = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(',').map((url) => url.trim())
  : [];

const allowedOrigins = [
  ...parsedEnvUrls,
  process.env.FRONTEND_URL,
  'https://startup-crm-lite-gray.vercel.app',
  'https://startup-crm-lite-op22.vercel.app',
  'https://startup-crm-lite-teal.vercel.app',
  ...(process.env.NODE_ENV === 'production' ? [] : devOrigins)
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.includes('vercel.app')
      ) {
        return callback(null, true);
      }

      callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.get('/api/health', (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED';

  res.status(200).json({
    status: 'OK',
    dbStatus,
    timestamp: new Date()
  });
});

const dbGuard = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database connection is currently unavailable. Please try again later.'
    });
  }

  next();
};

app.use('/api', dbGuard);

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function startServer() {
  checkRequiredEnvVars();

  try {
    await connectDB();
  } catch (error) {
    console.error(
      `Database connection failed: ${error.message}. Express server not started.`
    );
    console.log('Retrying database connection in 5 seconds...');
    setTimeout(startServer, 5000);
    return;
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
  });

  const gracefulShutdown = (signal) => {
    console.log(`\nReceived ${signal}. Server shutting down gracefully...`);

    server.close(async () => {
      console.log('HTTP Server closed.');

      try {
        await mongoose.connection.close();
        console.log('MongoDB connection disconnected.');
        process.exit(0);
      } catch (err) {
        console.error(`Error disconnecting MongoDB: ${err.message}`);
        process.exit(1);
      }
    });
  };

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
}

startServer();