import axios from "axios";
import { getDateSDT } from "../utils/date.js";

const url =
  "https://www.shinhansec.com/siw/wealth-management/fund/59900102/data.do";

// 펀드 수익률 페이지 - 수익률 표 전체 response 반환
async function fetchFundProfitTablePage(fundCode) {
  try {
    const sdt = await getDateSDT();
    const body = {
      header: {
        TCD: "S",
        SDT: sdt, // 현재 시간 ex. 20240319092300171
        SVW: "/siw/wealth-management/fund/599001/view.do",
      },
      body: {
        fund_code: fundCode,
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

// 수익률 표 생성
async function getFundProfitTable(fundCode) {
  const response = await fetchFundProfitTablePage(fundCode);
  const bodyData = response.data.body;
  let fundProfit = { 수익률: {} };
  if (bodyData) {
    let target = bodyData.data2;
    if (target) {
      fundProfit.수익률.기준일 = target["기준일"];
    }

    const range = [
      "1일",
      "1주일",
      "1개월",
      "3개월",
      "6개월",
      "9개월",
      "1년",
      "2년",
      "설정일 이후",
    ];

    let table = {};
    for (let idx in target["반복데이타0"][0]) {
      const data = target["반복데이타0"][0][idx];

      if (idx > 0 && idx < 10) {
        table[`${range[idx - 1]}`] = data;
      }
    }
    fundProfit.수익률.표 = table;
  }
  return fundProfit;
}

async function run() {
  let fundProfit = await getFundProfitTable("2053305");
  console.log(fundProfit);
}

run();
