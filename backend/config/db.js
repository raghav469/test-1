const mongoose = require('mongoose');

let connectionPromise;

async function connectDB() {
  const { MONGO_URI } = process.env;

  if (!MONGO_URI) {
    throw new Error('MONGO_URI is not set in the environment');
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(MONGO_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 8000,
      })
      .then(() => {
        console.log(
          `MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`,
        );
      })
      .finally(() => {
        connectionPromise = undefined;
      });
  }

  await connectionPromise;
}

module.exports = connectDB;