import http from 'http';
import app from './src/app.js';
import config from './src/config/config.js';
import connectDB from "./src/config/db.config.js"
import qdrant from "./src/config/qdrant.js"

const startServer = async () => {
  try {
    await connectDB();

    const result = await qdrant.getCollections();
    console.log('Collections found:', result.collections.length);

    const server = http.createServer(app);
    // app.listen(config.port, () => {
    //   console.log(`Server running on port ${config.port}`);
    // });
    server.listen(config.port, () => {
      console.log(`Server is listening on port ${config.port}`);
    });


    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();