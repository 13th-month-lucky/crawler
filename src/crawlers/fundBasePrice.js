import axios from "axios";
import { getDateSDT, getDateYMD } from "../utils/date.js";
import { figletAsync, progressBar } from "../utils/visualization.js";
import { connectDB, disconnectDB } from "../utils/database.js";
import { randomDelay } from "../utils/delay.js";
import { Fund } from "../models/Fund.js";

const url =
  "https://www.shinhansec.com/siw/wealth-management/fund/59900105/data.do";

// 펀드 기준가 페이지 - 전체 response 반환
async function fetchBasePricePage(fundCode) {
  try {
    const sdt = await getDateSDT();
    const startDate = "20231220"; // TODO: 1. 설정일 이후 적용할 것인지? 2. 업데이트 날짜 이후로 적용할 것인지?
    const endDate = await getDateYMD();
    const body = {
      header: {
        TCD: "S",
        SDT: sdt, // 현재 시간 ex. 20240319092300171
        SVW: "/siw/wealth-management/fund/599001/view.do",
      },
      body: {
        fund_code: fundCode,
        sDate: startDate,
        eDate: endDate,
        termType: "2",
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

// 기준가 차트, 표에 들어갈 데이터
async function getFundBasePrices(fundCode) {
  const response = await fetchBasePricePage(fundCode);
  const bodyData = response.data.body;
  let fundBasePrices = [];
  if (bodyData) {
    let target = bodyData.data4["반복데이타0"];

    for (let data of target) {
      let dailyData = {
        기준일: data[0],
        기준가: data[1],
        설정액: data[16],
        전일대비: data[3],
      };
      fundBasePrices.push(dailyData);
    }
  }
  return fundBasePrices;
}

async function run() {
  const figletData = await figletAsync("Fund Base Price");
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
      let fundBasePrices = await getFundBasePrices(fundCode);
      await Fund.updateOne(
        { code: fundCode },
        { $set: { basePrice: fundBasePrices } }
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
