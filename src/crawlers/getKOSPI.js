import moment from "moment";
import axios from "axios";
import mongoose from "mongoose";
import { connectDB } from "../utils/database.js";

const KospiSchema = new mongoose.Schema({
  data: [
    {
      localDate: String,
      closePrice: Number,
    },
  ],
});

const Kospi = mongoose.model("Kospi", KospiSchema);

async function saveKospiData(kospiDataArray) {
  try {
    await connectDB();

    const newData = new Kospi({ data: kospiDataArray });
    const savedData = await newData.save();
  } catch (error) {
    console.log("Error saving KOSPI data:", error.message);
  }
}

const kospiDataArray = [];

const fetchAndPushData = async (startDateTime) => {
  try {
    const response = await axios.get(
      `https://api.stock.naver.com/chart/domestic/index/KOSPI/day?startDateTime=${startDateTime}0000&endDateTime=${startDateTime}0000`
    );

    console.log(response.data[0].localDate);

    kospiDataArray.push(response.data[0]);
  } catch (error) {
    console.log("Error fetching data:", error.message);
    // If data is not available for the requested date, try fetching data for the previous day
    const previousDay = moment(startDateTime, "YYYYMMDD")
      .subtract(1, "day")
      .format("YYYYMMDD");
    await fetchAndPushData(previousDay);
  }
};

async function getKospiData() {
  const currentDate = moment().format("YYYYMMDD").toString();
  const oneDayBefore = moment()
    .subtract(1, "day")
    .format("YYYYMMDD")
    .toString();
  const oneWeekBefore = moment()
    .subtract(1, "week")
    .format("YYYYMMDD")
    .toString();
  const oneMonthBefore = moment()
    .subtract(1, "month")
    .format("YYYYMMDD")
    .toString();
  const threeMonthBefore = moment()
    .subtract(3, "month")
    .format("YYYYMMDD")
    .toString();
  const sixMonthBefore = moment()
    .subtract(6, "month")
    .format("YYYYMMDD")
    .toString();
  const oneYearBefore = moment()
    .subtract(1, "year")
    .format("YYYYMMDD")
    .toString();

  await fetchAndPushData(oneDayBefore);
  await fetchAndPushData(oneWeekBefore);
  await fetchAndPushData(oneMonthBefore);
  await fetchAndPushData(threeMonthBefore);
  await fetchAndPushData(sixMonthBefore);
  await fetchAndPushData(oneYearBefore);

  const dbData = kospiDataArray.map((response) => ({
    localDate: response.localDate,
    closePrice: response.closePrice,
  }));
  console.log(dbData);

  await saveKospiData(dbData);
}

getKospiData();

// console.log(dbData);

// const oneDay = await axios.get(
//   `https://api.stock.naver.com/chart/domestic/index/KOSPI/day?startDateTime=${oneDayBefore}0000&endDateTime=${oneDayBefore}0000`
// );
// const oneWeek = await axios.get(
//   `https://api.stock.naver.com/chart/domestic/index/KOSPI/day?startDateTime=${oneWeekBefore}0000&endDateTime=${oneWeekBefore}0000`
// );
// const oneMonth = await axios.get(
//   `https://api.stock.naver.com/chart/domestic/index/KOSPI/day?startDateTime=${oneMonthBefore}0000&endDateTime=${oneMonthBefore}0000`
// );
// const threeMonth = await axios.get(
//   `https://api.stock.naver.com/chart/domestic/index/KOSPI/day?startDateTime=${threeMonthBefore}0000&endDateTime=${threeMonthBefore}0000`
// );
// const sixMonth = await axios.get(
//   `https://api.stock.naver.com/chart/domestic/index/KOSPI/day?startDateTime=${sixMonthBefore}0000&endDateTime=${sixMonthBefore}0000`
// );
// const oneYear = await axios.get(
//   `https://api.stock.naver.com/chart/domestic/index/KOSPI/day?startDateTime=${oneYearBefore}0000&endDateTime=${oneYearBefore}0000`
// );

// kospiDataArray.push(oneDay.data[0]);
// kospiDataArray.push(oneWeek.data[0]);
// kospiDataArray.push(oneMonth.data[0]);
// kospiDataArray.push(threeMonth.data[0]);
// kospiDataArray.push(sixMonth.data[0]);
// kospiDataArray.push(oneYear.data[0]);
