import userModel from "../models/userModel.js";
import { Webhook } from "svix";
import connectDB from "../configs/mongodb.js";

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

export { clerkWebhooks };
