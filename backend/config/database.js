import mongoose from 'mongoose';

/**
 * Connects to MongoDB Atlas using MONGODB_URI environment variable.
 * Throws exceptions to caller on failures to let startup scripts coordinate listeners.
 *
 * @returns {Promise<Object>} Mongoose connection object.
 */
export async function connectDB() {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error('Error: MONGODB_URI environment variable is not defined.');
    throw new Error('MONGODB_URI is undefined');
  }

  // Connect to MongoDB using modern Mongoose parameters
  const conn = await mongoose.connect(mongoURI);
  console.log('MongoDB connected');
  return conn;
}

export default connectDB;
