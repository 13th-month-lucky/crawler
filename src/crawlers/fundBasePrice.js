import axios from "axios";
import { getDateSDT, getDateYMD } from "../utils/date.js";

const url =
  "https://www.shinhansec.com/siw/wealth-management/fund/59900105/data.do";

// 펀드 기준가 페이지 - 전체 response 반환
async function fetchBasePricePage(fundCode) {
  try {
    const sdt = await getDateSDT();
    const startDate = "20231220"; // TODO: 설정일 이후 적용할 것인지 체크
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

// 기준가 차트, 표 생성
async function getFundBasePrice(fundCode) {
  const response = await fetchBasePricePage(fundCode);
  const bodyData = response.data.body;
  let fundBasePrice = { "기준가 전체": [] };
  if (bodyData) {
    let target = bodyData.data4["반복데이타0"];

    for (let idx in target) {
      let dailyData = {
        기준일: target[idx][0],
        기준가: target[idx][1],
        설정액: target[idx][16],
        전일대비: target[idx][3],
      };
      fundBasePrice["기준가 전체"].push(dailyData);
    }
  }
  return fundBasePrice;
}

async function run() {
  let fundBasePrice = await getFundBasePrice("2053305");
  console.log(fundBasePrice);
}

run();
