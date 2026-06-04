import userModel from "../models/userModel.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  console.log("WEBHOOK HIT");

  try {
    console.log("SECRET:", !!process.env.CLERK_WEBHOOK_SECRET);

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    console.log("VERIFYING");

    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    console.log("VERIFIED");

    const { data, type } = req.body;

    console.log("TYPE:", type);

    switch (type) {
      case "user.created": {
        console.log("Inside user.created");

        const userData = {
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.image_url,
        };

        console.log("USER DATA:", userData);

        const newUser = await userModel.create(userData);

        console.log("Saved User:", newUser);

        res.json({});
        break;
      }

      default:
        console.log("Unhandled event");
        res.json({});
    }
  } catch (error) {
    console.log("FULL ERROR");
    console.error(error);

    console.log("ERROR MESSAGE");
    console.log(error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { clerkWebhooks };
