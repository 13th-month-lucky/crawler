import axios from "axios";
import iconv from "iconv-lite";
import cheerio from "cheerio";
import mongoose from "mongoose";
import { connectDB } from "../utils/database.js";

const etfNewsSchema = new mongoose.Schema([
  {
    code: Number,
    data: [
      {
        news_title: String,
        news_content: String,
        news_img: String,
        news_link: String,
      },
    ],
  },
]);

const etfNewsDataArray = [];

const EtfNews = mongoose.model("etfNews", etfNewsSchema); // Corrected model name

async function saveEtfNewsData(etfNewsDataArray) {
  try {
    await connectDB();
    // const newData = new EtfNews(data={ data:z etfNewsDataArray });
    // const newData = new EtfNews(etfNewsDataArray);
    // const savedData = await newData.save();
    // console.log(savedData);
    EtfNews.insertMany(etfNewsDataArray);
  } catch (error) {
    console.log("Error saving ETF news data:", error.message);
  }
}

async function fetchNewsData(etfArray) {
  console.log(etfArray.length);
  for (let i = 0; i < etfArray.length; i++) {
    // Corrected array length
    try {
      const response = await axios.get(
        `https://search.naver.com/search.naver?where=news&query=${etfArray[i].name}`,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
          responseType: "arraybuffer",
        }
      );
      const decodeContent = iconv.decode(Buffer.from(response.data), "utf-8");
      const $ = cheerio.load(decodeContent);
      const result = $(".news_area")
        .map((i, el) => {
          const news_title = $(el).find(".news_tit").text();
          const news_content = $(el).find(".news_dsc").text();
          const news_img = $(el)
            .find(".news_contents img")
            .attr("data-lazysrc");
          const news_link = $(el)
            .find(".news_contents .dsc_thumb")
            .attr("href");
          return { news_title, news_content, news_img, news_link };
        })
        .get();

      etfNewsDataArray.push({ code: etfArray[i].code, data: result });
    } catch (err) {
      console.error(err);
    }
  }
  // console.log(etfNewsDataArray[0]); // Corrected pushing structure

  return etfNewsDataArray; // Return the array
}

async function main(etfArray) {
  try {
    const news = await fetchNewsData(etfArray);
    console.log(etfNewsDataArray);
    await saveEtfNewsData(etfNewsDataArray); // Pass news to the saving function
    console.log("Data saved successfully!");
  } catch (error) {
    console.error("Error:", error);
  }
}

const etfArray = [
  { code: "461600", name: "SOL 미국30년국채액티브(H)" },
  { code: "423170", name: "SOL 한국형글로벌반도체액티브" },
  { code: "455860", name: "SOL 2차전지소부장Fn" },
  { code: "459370", name: "SOL 유럽탄소배출권선물인버스ICE(H)" },
];

main(etfArray);
