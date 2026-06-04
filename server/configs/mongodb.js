import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Database Connected");
  } catch (error) {
    console.error("MongoDB Error:", error);
  }
};

export default connectDB;