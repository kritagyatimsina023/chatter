import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected successfully", connection.connection.host);
  } catch (error) {
    console.error("Error connecting to mongodb", error);
    process.exit(1); // 1 status code means faild and 0 means success
  }
};
