import axios from "axios";
import * as cheerio from "cheerio";

async function getEtfExtraInfo(searchNumber, index) {
  const baseURL =
    "https://www.soletf.com/ko/fund/etf/" +
    `${searchNumber}` +
    "?tabIndex=" +
    `${index}`;
  try {
    const resp = await axios.get(baseURL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      },
    });

    const $ = cheerio.load(resp.data);
    if (index === 2) {
      const dangerInfo = JSON.parse($("#risk-grade").attr("data-grid"));
      const dangerDegree = dangerInfo.option.values;
      return dangerDegree;
    } else if (index === 3) {
      const etfRatio = $("#data-pdf-rows tr")
        .map((index, element) => {
          const companyName = $(element).find("td").eq(1).text();
          const percentage = $(element).find("td").last().text();

          return {
            companyName: companyName,
            percentage: percentage,
          };
        })
        .get();
      return etfRatio;
    }
  } catch (error) {}
}

export { getEtfExtraInfo };
