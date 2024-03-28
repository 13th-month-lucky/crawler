import mongoose from "mongoose";
import { connectDB } from "../utils/database.js";

const KospiSchema = new mongoose.Schema({
  data: { type: Object, default: {} },
  closingPrice: { type: Object, default: {} },
});

export const Kospi = mongoose.model("Kospi", KospiSchema);

export async function saveKospiData(KospiData) {
  try {
    await connectDB();

    Kospi.insertMany(KospiData).then((data) => {
      console.log(data);
    });
  } catch (error) {
    console.log("error:" + error.message);
  }
}
