// import mongoose from 'mongoose';
// import config from './config.js';

// const connectDB = async () => {
//   try {
//     await mongoose.connect(config.database.uri, {
//       ...config.database.options,
//     });

//     console.log('MongoDB connected successfully');
//   } catch (error) {
//     console.error('MongoDB connection failed:', error);
//     process.exit(1);
//   }
// };

// export default connectDB;


// import mongoose from "mongoose";
// import config from "./config.js";

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// const connectDB = async () => {
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(config.database.uri, {
//       ...config.database.options,
//       bufferCommands: false,
//     });
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// };

// export default connectDB;



import mongoose from 'mongoose';
import config from './config.js';

const connectDB = async () => {
  try {
    if (!config.database.uri) {
      throw new Error('DATABASE_URI environment variable is not defined');
    }

    await mongoose.connect(config.database.uri);
    console.log('MongoDB connected successfully');

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
};

export default connectDB;
