import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/Boilerplate");
    console.log("MongoDB connected...");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("MongoDB connection failed:", error.message);
    } else {
      console.error("Unknown MongoDB connection error");
    }
    process.exit(1);
  }
};

export default connectDB;
