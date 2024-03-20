import mongoose from "mongoose";
import { connectDB, disconnectDB } from "../utils/database.js";

const fundSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  data: {
    type: Object,
    default: {},
  },
  // updated: { type: Date, required: true },
});

const Fund = mongoose.model("Fund", fundSchema);

export async function saveFundCodeListToDB(fundCodeList) {
  try {
    await connectDB();

    const existingFunds = await Fund.find({ code: { $in: fundCodeList } });

    const newFundCodes = fundCodeList.filter(
      (code) => !existingFunds.some((fund) => fund.code === code)
    );

    const newFundCodeList = newFundCodes.map((code) => ({ code }));

    if (newFundCodeList.length > 0) {
      await Fund.insertMany(newFundCodeList).then((data) => {
        console.log(data);
        disconnectDB();
      });
      console.log("New funds added to the database.");
    } else {
      console.log("All funds already exist in the database.");
      disconnectDB();
    }
  } catch (error) {
    console.error("\nError saving data:", error);
  }
}