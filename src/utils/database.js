import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectDB() {
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

export async function disconnectDB() {
  mongoose
    .disconnect()
    .then(() => {
      console.log("SUCCESS DISCONNECTION");
    })
    .catch((err) => console.log(err));
}
