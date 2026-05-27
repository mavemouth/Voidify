import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./configs/mongodb.js";
import userRouter from "./routes/userRoutes.js";

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
app.use("/api/user", userRouter);

// PORT
// const PORT = process.env.PORT || 4000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// Export for Vercel
export default app;
