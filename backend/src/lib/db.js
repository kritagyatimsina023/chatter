import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("No mongodb url included");
    }
    const connection = await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected successfully", connection.connection.host);
  } catch (error) {
    console.error("Error connecting to mongodb", error);
    process.exit(1); // 1 status code means faild and 0 means success
  }
};
