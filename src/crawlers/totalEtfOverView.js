import { getETFNumbers } from "../crawlers/stockNumberCrawler.js";
import { getEtfInfo } from "./etfInfoCrawler.js";
import { getEtfExtraInfo } from "./etfTabCrawler.js";
import { getNewEtfChart } from "../openapi/getNewEtfChart.js";
import moment from "moment";
import { saveOrUpdateEtfOverView } from "../models/EtfOverView.js";

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getTotalEtfResult() {
  const currentDate = moment().format("YYYYMMDD").toString();
  const oneYearBefore = moment()
    .subtract(1, "year")
    .format("YYYYMMDD")
    .toString();

  console.log(currentDate);
  console.log(oneYearBefore);
  const codes = await getETFNumbers();
  for (let i = 0; i < codes.length; i++) {
    const code = codes[i];
    const basicInfo = await getEtfInfo(code.searchNumber);
    const dangerDegree = await getEtfExtraInfo(code.searchNumber, 2);
    const ratio = await getEtfExtraInfo(code.searchNumber, 3);
    const resultChart = await getNewEtfChart(
      code.stockNumber,
      oneYearBefore,
      currentDate
    );

    const overViewResult = {
      code: code.stockNumber,
      data: {
        basicInfo: basicInfo,
        dangerDegree: dangerDegree,
        ratio: ratio,
      },
      chart: resultChart,
    };

    // fs.writeFileSync(`${code.stockNumber}.json`, JSON.stringify(overViewResult));

    saveOrUpdateEtfOverView(overViewResult);

    // 10개의 요청마다 1초의 지연을 추가
    if ((i + 1) % 10 === 0) {
      await delay(1000);
    } else {
      // 그렇지 않으면 각 요청 사이에 약 100ms의 지연을 추가
      await delay(100);
    }
  }
}

getTotalEtfResult();
