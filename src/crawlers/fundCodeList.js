import axios from "axios";
import { fileNames, saveJson } from "../utils/file.js";
import { getDateSDT, getDateYMD } from "../utils/date.js";
import { saveFundCodeListToDB } from "../models/fund.js";
import { figletAsync, progressBar } from "../utils/visualization.js";

const url = "https://www.shinhansec.com/siw/common/nio/data.do";

// 펀드 리스트 페이지 전체 response 반환
async function fetchFundListPage(page) {
  try {
    const sdt = await getDateSDT();
    const body = {
      header: {
        TCD: "S",
        SDT: sdt, // 현재 시간 ex. 20240319092300171
        SVW: "/siw/pension/saving-holder/49100304/view.do",
      },
      body: {
        pt: "Q2",
        sc: "112",
        tr: "SBCC113Q4",
        wk: "Q",
        rc: "999",
        input: [
          {
            v: "",
            l: 12,
          },
          {
            v: page, // 현재 페이지
            l: 18,
          },
          {
            v: 12,
            l: 18,
          },
          {
            v: "0",
            l: 1,
          },
          {
            v: "1",
            l: 1,
          },
          {
            v: "2",
            l: 2,
          },
          {
            v: "1",
            l: 1,
          },
          {
            v: "1",
            l: 1,
          },
          {
            v: "1",
            l: 1,
          },
          {
            v: "0",
            l: 1,
          },
          {
            v: "N",
            l: 1,
          },
          {
            v: "",
            l: 50,
          },
          {
            v: "",
            l: 1,
          },
        ],
      },
    };

    const response = await axios.post(url, body, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      },
    });
    return response;
  } catch (error) {
    console.error(`Error fetching page: ${url}`, error.message);
    return null;
  }
}

// 펀드 리스트 페이지에서 펀드 코드 리스트를 반환
async function getFundCodeList(totalPage) {
  let results = [];

  progressBar.start(totalPage, 0);
  for (let page = 1; page <= totalPage; page++) {
    const response = await fetchFundListPage(page, url);
    const bodyData = response.data.body;
    if (bodyData) {
      bodyData["list01"].forEach((fund) => {
        if (fund["온라인전용여부"] === "Y") {
          results.push(fund["펀드코드"]);
        }
      });
    }

    progressBar.increment();
  }

  return results;
}

// 펀드 리스트의 전체 페이지 수를 반환
async function getTotalPage() {
  const response = await fetchFundListPage(1, url);
  const bodyData = response.data.body;
  if (bodyData) {
    return bodyData["페이지수"];
  }

  return 1;
}

async function run() {
  const figletData = await figletAsync("Fund Code List Crawler");
  console.log(figletData);

  const ymd = await getDateYMD();
  const fileName = `${ymd}-${fileNames.fundList}`;

  const totalPage = await getTotalPage();
  const fundCodeList = await getFundCodeList(totalPage);

  await saveJson(fileName, fundCodeList);
  await saveFundCodeListToDB(fundCodeList);
}

run();
