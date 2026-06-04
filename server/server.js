import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

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
app.post("/test", (req, res) => {
  console.log("TEST POST HIT");
  console.log(req.body);

  res.json({
    success: true,
  });
});
// PORT
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export for Vercel
export default app;
