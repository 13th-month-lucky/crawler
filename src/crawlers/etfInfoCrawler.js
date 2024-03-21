import axios from "axios";
import * as cheerio from "cheerio";

async function getEtfInfo(searchNumber) {
  const baseURL = "https://www.soletf.com/ko/fund/etf/" + `${searchNumber}`;
  try {
    const resp = await axios.get(baseURL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      },
    });

    const $ = cheerio.load(resp.data);
    const title = $(".fv-name").text();
    const description = $(".fv-des").text().trim();

    const stockData = $(".dl-data .def")
      .map((index, element) => {
        const dataName = $(element).find("dt").text().trim();

        let data;
        if (dataName.includes("분배금지급")) {
          data = $(element).find("dd").first().text();
          return { 분배금지급: data };
        } else {
          data = $(element).find("dd").text();
          if (dataName.includes("사무수탁사")) {
            return { 사무수탁사: data };
          }
          if (dataName.includes("순자산 총액")) {
            return { 순자산총액: data };
          }
          if (dataName.includes("상장일")) {
            return { 상장일: data };
          }
          if (dataName.includes("수탁은행")) {
            return { 수탁은행: data };
          }
          if (dataName.includes("설정단위")) {
            return { 설정단위: data };
          }
          if (dataName.includes("최소거래단위")) {
            return { 최소거래단위: data };
          }
        }
      })
      .get();

    stockData.unshift({ 종목이름: title });
    stockData.unshift({ 종목설명: description });

    const formattedData = {};
    stockData.forEach((item) => {
      formattedData[Object.keys(item)[0]] = Object.values(item)[0];
    });
    return formattedData;
  } catch (error) {
    console.log("error: " + error.message);
  }
}

export { getEtfInfo };
