import axios from "axios";
import { getDateSDT, getDateYMD } from "../utils/date.js";
import { figletAsync, progressBar } from "../utils/visualization.js";
import { connectDB, disconnectDB } from "../utils/database.js";
import { randomDelay } from "../utils/delay.js";
import { Fund } from "../models/Fund.js";

const url =
  "https://www.shinhansec.com/siw/wealth-management/fund/59900106/data.do";

// 펀드 운용정보 페이지 - 전체 response 반환
async function fetchPortfolioPage(fundCode) {
  try {
    const sdt = await getDateSDT();
    const startDate = await getDateYMD();
    const body = {
      header: {
        TCD: "S",
        SDT: sdt, // 현재 시간 ex. 20240319092300171
        SVW: "/siw/wealth-management/fund/599001/view.do",
      },
      body: {
        fund_code: fundCode,
        startDate: startDate,
      },
    };

    const response = await axios.post(url, body, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error(`Error fetching page: ${url}`, error.message);
    return null;
  }
}

// 포트폴리오
async function getFundPortfolio(fundCode) {
  const response = await fetchPortfolioPage(fundCode);
  const bodyData = response.data.body;
  let fundPortfolio = {};
  if (bodyData) {
    let target = bodyData.data2;
    if (target) {
      fundPortfolio["포트폴리오"] = target["반복데이타0"].map((item) => {
        return [item[0], parseFloat(item[1])];
      });
    }

    target = bodyData.data3;
    if (target) {
      fundPortfolio["보유종목 Top10"] = target["반복데이타0"];
    }
  }
  return fundPortfolio;
}

async function run() {
  const figletData = await figletAsync("Fund Portfolio");
  console.log(figletData);
  let fundCode;

  try {
    await connectDB();

    // 1. DB에서 모든 코드를 가져온다.
    const fundCodes = await Fund.getAllCodes();

    // 2. 반복문 돌려서 업데이트 한다.
    progressBar.start(fundCodes.length, 0);
    for (fundCode of fundCodes) {
      await randomDelay(2);
      // 기본 정보
      let fundPortfolio = await getFundPortfolio("2053305");
      await Fund.updateOne(
        { code: fundCode },
        { $set: { portfolio: fundPortfolio } }
      ).then((data) => {
        // DB 업데이트
        progressBar.increment();
      });
    }
  } catch (e) {
    console.log(`====== Error in ${fundCode} =======`);
    console.error(e);
    console.log();
  } finally {
    await disconnectDB();
  }
}

run();
