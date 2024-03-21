import { getEtfChart } from "../openapi/getEtfChart.js";
import moment from "moment";
import fs from "fs";
async function saveEtfChart(stockNumber) {
  const stringStockNumber = stockNumber.toString();
  // console.log(stringStockNumber);
  const currentDate = moment().format("YYYYMMDD").toString();
  const oneYearBefore = moment()
    .subtract(1, "year")
    .format("YYYYMMDD")
    .toString();
  const sixMonthBefore = moment()
    .subtract(6, "month")
    .format("YYYYMMDD")
    .toString();
  const threeMonthBefore = moment()
    .subtract(3, "month")
    .format("YYYYMMDD")
    .toString();
  const oneMonthBefore = moment()
    .subtract(1, "month")
    .format("YYYYMMDD")
    .toString();
  const oneWeekBefore = moment()
    .subtract(1, "week")
    .format("YYYYMMDD")
    .toString();

  //1년
  const yearChart = await getEtfChart(stockNumber, oneYearBefore, currentDate);
  // // fs.writeFileSync("year.json", JSON.stringify(yearChart));
  // // //6개월
  // const halfYearChart = await getEtfChart(
  //   stringStockNumber,
  //   sixMonthBefore,
  //   currentDate
  // );
  // // fs.writeFileSync("month.json", JSON.stringify(halfYearChart));
  // // //3개월
  // const threeMonthChart = await getEtfChart(
  //   stringStockNumber,
  //   threeMonthBefore,
  //   currentDate
  // );
  // // //1개월
  // const oneMonthChart = await getEtfChart(
  //   stringStockNumber,
  //   oneMonthBefore,
  //   currentDate
  // );
  // //1주
  // const oneWeekChart = await getEtfChart(
  //   stringStockNumber,
  //   oneWeekBefore,
  //   currentDate
  // );

  const chartResult = {
    code: stockNumber,
    // name: oneWeekChart.output1.hts_kor_isnm,
    chart: {
      one_year: yearChart,
      // six_month: halfYearChart,
      // three_month: threeMonthChart,
      // one_month: oneMonthChart,
      // one_week: oneWeekChart,
    },
  };

  return chartResult;
}

// saveEtfChart();
export { saveEtfChart };
