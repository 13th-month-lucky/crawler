import mongoose from "mongoose";
import { connectDB } from "../utils/database.js";

const etfOverViewSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  data: { type: Object, default: {} },
  chart: { type: Object, default: {} },
});

export const EtfOverView = mongoose.model("EtfOverView", etfOverViewSchema);

export async function saveOrUpdateEtfOverView(overViewResult) {
  try {
    await connectDB();

    const existingEtfOverView = await EtfOverView.findOne({
      code: overViewResult.code,
    });

    if (existingEtfOverView) {
      //이미 같은 코드의 데이터가 있으면 update
      EtfOverView.updateOne(
        { code: overViewResult.code },
        { chart: overViewResult.chart }
      ).then((data) => {
        console.log(data);
      });
    } else {
      EtfOverView.insertMany(overViewResult).then((data) => {
        console.log(data);
      });
    }
  } catch (error) {
    console.log("error:" + error.message);
  }
}
