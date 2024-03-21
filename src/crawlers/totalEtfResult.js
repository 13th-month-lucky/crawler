import { getETFNumbers } from "../crawlers/stockNumberCrawler.js";
import { getEtfChart } from "../openapi/getEtfChart.js";
import { saveOrUpdateEtfInfo } from "../models/EtfInfo.js";
import { saveOrUpdateEtfChart } from "../models/EtfChart.js";
import { saveEtfChart } from "../openapi/saveEtfChart.js";
import { getEtfInfo } from "./etfInfoCrawler.js";
import { getEtfExtraInfo } from "./etfTabCrawler.js";
import fs from "fs";
import moment from "moment";

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getTotalEtfResult() {
  const currentDate = moment().format("YYYYMMDD").toString();
  const oneYearBefore = moment()
    .subtract(1, "year")
    .format("YYYYMMDD")
    .toString();

  const codes = await getETFNumbers();
  for (let i = 0; i < codes.length; i++) {
    const code = codes[i];
    const basicInfo = await getEtfInfo(code.searchNumber);
    const dangerDegree = await getEtfExtraInfo(code.searchNumber, 2);
    const ratio = await getEtfExtraInfo(code.searchNumber, 3);

    const resultInfo = {
      code: code.stockNumber,
      data: {
        basicInfo: basicInfo,
        dangerDegree: dangerDegree,
        ratio: ratio,
      },
    };

    console.log("resultStockNum:" + code.stockNumber);
    const resultChart = await getEtfChart(
      code.stockNumber,
      oneYearBefore,
      currentDate
    );

    saveOrUpdateEtfInfo(resultInfo);
    saveOrUpdateEtfChart(resultChart);

    // 10개의 요청마다 1초의 지연을 추가합니다.
    if ((i + 1) % 10 === 0) {
      await delay(1000);
    } else {
      // 그렇지 않으면 각 요청 사이에 약 100ms의 지연을 추가합니다.
      await delay(100);
    }
  }
}

getTotalEtfResult();
