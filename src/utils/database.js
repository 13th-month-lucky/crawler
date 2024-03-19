import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export function connectDB() {
  mongoose
    .connect(process.env.MONGO_CONNECT, {
      retryWrites: true,
      w: "majority",
    })
    .then((resp) => {
      // console.log(resp);
      console.log("SUCCESS CONNECTION");
    });
}

connectDB();
