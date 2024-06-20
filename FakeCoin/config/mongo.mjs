import mongoose from 'mongoose';

export const connectMongo = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);

  console.log(
    `Mongo DB är ansluten till ${conn.connection.host}`.green.underline.bold
  );
};
