import mongoose from "mongoose";

const uri =
  "mongodb+srv://adityasagar582_db_user:nBJXYPRJ9eTKWG0f@cluster0.hpagpuq.mongodb.net/voidify?retryWrites=true&w=majority";

try {
  console.log("Connecting...");

  await mongoose.connect(uri);

  console.log("CONNECTED TO MONGODB");

  process.exit(0);
} catch (err) {
  console.error(err);
}