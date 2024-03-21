import mongoose from "mongoose";
import { connectDB } from "../utils/database.js";

const etfChartSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  chart: { type: Object, default: {} },
});

export const EtfChart = mongoose.model("EtfChart", etfChartSchema);

export async function saveOrUpdateEtfChart(chartResult) {
  try {
    await connectDB();

    const existingChart = await EtfChart.findOne({ code: chartResult.code });

    if (existingChart) {
      //이미 같은 코드의 데이터가 있으면 update
      EtfChart.updateOne(
        { code: chartResult.code },
        { chart: chartResult.chart }
      ).then((data) => {
        console.log(data);
      });
    } else {
      EtfChart.insertMany(chartResult).then((data) => {
        console.log(data);
      });
    }
  } catch (error) {
    console.log("error:" + error.message);
  }
}
