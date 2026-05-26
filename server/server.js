import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./configs/mongodb.js";

const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(express.json());
app.use(cors());

// Route
app.get("/", (req, res) => {
  res.send("API Working");
});

// Export for Vercel
export default app;
