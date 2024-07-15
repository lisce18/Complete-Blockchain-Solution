import mongoose from 'mongoose';

export const connectMongo = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);

  console.log(
    `Mongo DB är ansluten till ${conn.connection.host}`.green.underline.bold
  );

  return conn.connection.getClient();
};

export const closeMongoDBConnection = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB connection closed successfully.');
  } catch (error) {
    console.error('Failed to close MongoDB connection:', error);
  }
};
