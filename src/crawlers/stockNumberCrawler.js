import axios from "axios";
import dotenv from "dotenv";
import fs, { link } from "fs";
import * as cheerio from "cheerio";

//신한자산운용에서 html받아옴
async function getShinhan() {
  const baseURL = "https://www.soletf.com/ko/fund";
  try {
    const resp = await axios.get(baseURL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      },
    });

    return resp.data;
  } catch (error) {
    console.log("error: " + error.message);
  }
}

//그 안에서 ETF 종목 번호만 배열로 가져옴
async function getETFNumbers() {
  const result = await getShinhan();
  const $ = cheerio.load(result);
  let stockNumbers = [];
  $(".fd-name").each((index, element) => {
    const text = $(element).text();
    const numberMatch = text.match(/\((\d+)\)/);
    if (numberMatch) {
      stockNumbers.push(numberMatch[1]);
    }
  });

  let etfNumbers = [];
  $(".fd-link").each((index, element) => {
    const href = $(element).attr("href");
    const parts = href.split("/");
    const number = parts[parts.length - 1];
    if (!number.startsWith("00000")) {
      etfNumbers.push({
        searchNumber: number,
        stockNumber: stockNumbers[index],
      });
    }
  });
  return etfNumbers;
}

export { getETFNumbers };
