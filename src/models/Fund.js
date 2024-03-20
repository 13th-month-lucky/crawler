import mongoose from "mongoose";
import { connectDB, disconnectDB } from "../utils/database.js";

const fundSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  data: {
    type: Object,
    default: {},
  },
  portfolio: {
    type: Object,
    default: {},
  },
  // updated: { type: Date, required: true },
});

fundSchema.statics.getAllCodes = async function () {
  try {
    const codes = await this.find().then((funds) => {
      return funds.map((fund) => {
        return fund.code;
      });
    });
    return codes;
  } catch (err) {
    throw err;
  }
};

export const Fund = mongoose.model("Fund", fundSchema);

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
