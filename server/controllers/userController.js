const clerkWebhooks = async (req, res) => {
  console.log("Webhook hit");

  try {
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    console.log("Webhook verified");

    const { data, type } = req.body;

    switch (type) {
      case "user.created": {
        console.log("Creating user");

        const userData = {
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.image_url,
        };

        const newUser = await userModel.create(userData);

        console.log("Saved User:", newUser);

        res.json({});
        break;
      }

      default:
        res.json({});
    }
  } catch (error) {
    console.log("Webhook Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { clerkWebhooks };
