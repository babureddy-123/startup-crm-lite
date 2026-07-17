import './config/env.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import mongoose from 'mongoose';

// Import database, routes, and error configurations
import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';

/**
 * Validates that all required environment variables are present.
 * Prevents booting the application with missing configurations.
 */
function checkRequiredEnvVars() {
  const requiredVars = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error(`Fatal Error: Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
  }
}

// Initialize Express
const app = express();

// 1. General API rate limiter (100 requests per 15 minutes per IP)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

// 2. Strict Authentication rate limiter (10 attempts per 15 minutes per IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many auth attempts.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Mount rate limiters on respective API sub-routes
app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);

// 3. Security HTTP headers via Helmet
app.use(helmet());

// 4. Request Logging (combined details in production, concise/colorized in development)
const NODE_ENV = process.env.NODE_ENV || 'production';
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 5. MongoDB query injection sanitization (Express 5 compatibility fix)
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

// 6. Dynamic CORS Origin check list mapping production endpoints
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
  ? process.env.FRONTEND_URLS.split(',').map(url => url.trim())
  : [];

const allowedOrigins = [
  ...parsedEnvUrls,
  process.env.FRONTEND_URL,
  ...(process.env.NODE_ENV === 'production' ? [] : devOrigins)
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

// 7. Request body parsing settings
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

/**
 * Health check status endpoint (remains open and accessible even if MongoDB is offline).
 */
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED';
  res.status(200).json({
    status: 'OK',
    dbStatus,
    timestamp: new Date()
  });
});

/**
 * Guard middleware verifying database connectivity before handling queries.
 * Returns a 503 error instead of crash outcomes.
 */
const dbGuard = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database connection is currently unavailable. Please try again later.'
    });
  }
  next();
};

// Mount database status check guard for all database-related API requests
app.use('/api', dbGuard);

// 8. Register endpoints
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// 9. Error Handler registered last
app.use(errorHandler);

// Boot server configurations
const PORT = process.env.PORT || 5000;

async function startServer() {
  // Validate env configurations on startup
  checkRequiredEnvVars();

  // Await database connection before booting Express HTTP listener
  try {
    await connectDB();
  } catch (error) {
    console.error(`Database connection failed: ${error.message}. Express server not started.`);
    console.log('Retrying database connection in 5 seconds...');
    setTimeout(startServer, 5000);
    return;
  }
  
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
  });

  /**
   * Gracefully shuts down the HTTP server and Mongoose connection when signals are received.
   *
   * @param {string} signal - Trigger signal (SIGINT/SIGTERM).
   */
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

  // Bind shutdown signals for graceful cluster scaling
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
}

startServer();
