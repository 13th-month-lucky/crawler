import mongoose from "mongoose";
import { connectDB } from "../utils/database.js";

const etfInfoSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  data: { type: Object, default: {} },
});

export const EtfInfo = mongoose.model("EtfInfo", etfInfoSchema);

export async function saveOrUpdateEtfInfo(etfResult) {
  try {
    await connectDB();

    const existingEtf = await EtfInfo.findOne({ code: etfResult.code });
    console.log(existingEtf);
    if (existingEtf) {
      //이미 같은 코드의 데이터가 있으면 update
      EtfInfo.updateOne(
        { code: etfResult.code },
        { data: etfResult.data }
      ).then((data) => {
        console.log("etfInfo:", data.code);
      });
    } else {
      EtfInfo.insertMany(etfResult).then((data) => {
        console.log("etfInfo insert:" + data);
      });
    }
  } catch (error) {
    console.log("error:" + error.message);
  }
}
