import express from "express";
import { clerkWebhooks, paymentRazorpay, userCredits, verifyRazorpay } from "../controllers/userController.js";
import authUser from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.get("/webhooks", (req, res) => {
  res.send("Webhook route exists");
});

userRouter.post("/webhooks", clerkWebhooks);
userRouter.get("/credits", authUser, userCredits);
userRouter.post("/pay-razor", authUser, paymentRazorpay);
userRouter.post("/verify-razor", verifyRazorpay);

export default userRouter;