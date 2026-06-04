import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("MONGODB_URI:", process.env.MONGODB_URI);

    mongoose.connection.on("connected", () => {
      console.log("Database Connected");
    });

    console.log("URI =", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);

  } catch (error) {
    console.error("MongoDB Error:", error);
  }
};

export default connectDB;