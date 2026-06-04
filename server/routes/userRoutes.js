import express from "express";
import { clerkWebhooks } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/webhooks", (req, res) => {
  res.send("Webhook route exists");
});

userRouter.post("/webhooks", clerkWebhooks);

export default userRouter;
