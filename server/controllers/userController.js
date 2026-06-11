import userModel from "../models/userModel.js";
import { Webhook } from "svix";
import connectDB from "../configs/mongodb.js";
import razorpay from "razorpay";
import transactionModel from "../models/transactionModel.js";

const clerkWebhooks = async (req, res) => {
  console.log("WEBHOOK HIT");

  try {
    await connectDB();
    console.log("SECRET EXISTS:", !!process.env.CLERK_WEBHOOK_SECRET);
    console.log("HEADERS:", req.headers);
    console.log("BODY:", req.body);

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    console.log("VERIFYING");

    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    console.log("VERIFIED");

    const { data, type } = req.body;

    switch (type) {
      case "user.created":
        await userModel.create({
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.profile_image_url,
        });
        console.log("USER SAVED");
        break;

      case "user.updated":
        await userModel.findOneAndUpdate(
          { clerkId: data.id },
          {
            email: data.email_addresses[0].email_address,
            firstName: data.first_name,
            lastName: data.last_name,
            photo: data.profile_image_url,
          }
        );
        console.log("USER UPDATED");
        break;

      case "user.deleted":
        await userModel.findOneAndDelete({
          clerkId: data.id,
        });
        console.log("USER DELETED");
        break;
    }

    return res.status(200).json({});
  } catch (error) {
    console.error("WEBHOOK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// API controller function to get user available credits data
const userCredits = async (req, res) => {
  try {
    await connectDB();
    const { clerkId } = req.body;
    console.log("userCredits requested for clerkId:", clerkId);
    const userData = await userModel.findOne({ clerkId });
    console.log("userData found:", userData);

    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found in database" });
    }

    res.json({ success: true, credits: userData.creditBalance });
  } catch (error) {
    console.error("userCredits error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Gateway Initialize
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// API to make payment for credits
const paymentRazorpay = async (req, res) => {
  try {
    await connectDB();
    const { clerkId, planId } = req.body;
    const userData = await userModel.findOne({ clerkId });
    if (!userData || !planId) return res.json({ success: false, message: "Invalid Credentials" });
    let credits, plan, amount, date;
    switch (planId) {
      case 'Basic':
        plan = 'Basic'
        credits = 100
        amount = 10
        break;

      case 'Advanced':
        plan = 'Advanced'
        credits = 500
        amount = 50
        break;

      case 'Business':
        plan = 'Business'
        credits = 5000
        amount = 250
        break;

      default:
        break;
    }
    date = Date.now();

    // Creating transaction
    const transactionData = {
      clerkId,
      plan,
      amount,
      credits,
      date
    };

    const newTransaction = await transactionModel.create(transactionData);

    const options = {
      amount: amount * 100,
      currency: process.env.CURRENCY,
      receipt: newTransaction._id
    };

    await razorpayInstance.orders.create(options, (error, order) => {
      if (error) return res.json({ success: false, message: error });
      res.json({ success: true, order });
    });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
}

// API Controller function to verify razorpay payment
const verifyRazorpay = async (req, res) => {
  try {
    await connectDB();
    const { razorpay_order_id } = req.body;
    const orderinfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if (orderinfo.status === 'paid') {
      const transactionData = await transactionModel.findById(orderinfo.receipt);
      if (transactionData.payment) return res.json({ success: false, message: "Payment Failed" });

      // Adding credits in user data
      const userData = await userModel.findOne({ clerkId: transactionData.clerkId });
      const creditBalance = userData.creditBalance + transactionData.credits;
      await userModel.findByIdAndUpdate(userData._id, { creditBalance });

      // Making the payment True
      await transactionModel.findByIdAndUpdate(transactionData._id, { payment: true });

      res.json({ success: true, message: "Credits Added" });
    } else {
      res.json({ success: false, message: "Payment Failed" });
    }

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
}

export { clerkWebhooks, userCredits, paymentRazorpay, verifyRazorpay };