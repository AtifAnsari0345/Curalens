import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Set strictQuery to prepare for Mongoose 7
    mongoose.set('strictQuery', false);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medicine-app', {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      autoIndex: true, // Build indexes
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Don't crash the server on connection error, allow for retry
    if (process.env.NODE_ENV === 'production') {
      console.error('Failed to connect to MongoDB. Check your connection string and network.');
      process.exit(1);
    }
    return null;
  }
};

export default connectDB;