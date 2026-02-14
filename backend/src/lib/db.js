import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDb = async () => {
  try {
    if (!ENV.MONGO_URL) {
      throw new Error("No mongodb url included");
    }
    const connection = await mongoose.connect(ENV.MONGO_URL);
    console.log("MongoDB connected successfully", connection.connection.host);
  } catch (error) {
    console.error("Error connecting to mongodb", error);
    process.exit(1); // 1 status code means faild and 0 means success
  }
};
