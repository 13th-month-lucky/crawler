import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import { getAcessToken } from "../utils/accessToken.js";

const AppKey = process.env.KOREA_INVEST_APPKEY;
const SecretKey = process.env.KOREA_INVEST_SECRETKEY;
const AccessToken = await getAcessToken();

async function getEtfChart(stockCode, inputDate1, inputDate2) {
  const code = stockCode.toString();
  const url = "https://openapivts.koreainvestment.com:29443";
  const PATH =
    "/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice";
  const baseURL = url + PATH;

  try {
    const resp = await axios.get(baseURL, {
      params: {
        fid_cond_mrkt_div_code: "J",
        fid_input_iscd: code,
        fid_input_date_1: inputDate1,
        fid_input_date_2: inputDate2,
        fid_period_div_code: "D",
        fid_org_adj_prc: "0",
      },
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " +
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6ImQzYmI1MTg4LWViZTktNGU2MS1iMjI0LTgxOWQ2NjZlZDgzNiIsImlzcyI6InVub2d3IiwiZXhwIjoxNzExMTk1MTU0LCJpYXQiOjE3MTExMDg3NTQsImp0aSI6IlBTUlBmT0FSU1pmWVpEYjNrdHNjS2JWZmxveXdjSWZJUkJScyJ9.lABFQuqUYr-xt2fZjkSzPhruQOrOOBHjmcxqxmIumLViIANZxS5RinC--WZehImC3HZgLEKPUceaQnIKcvWS0Q",
        appkey: AppKey,
        appsecret: SecretKey,
        tr_id: "FHKST03010100",
        custtype: "P",
      },
    });
    // console.log(resp.data);
    const chartResult = {
      code: stockCode,
      chart: resp.data,
    };

    return chartResult;
  } catch (error) {
    throw error;
  }
}
// getEtfChart(436140, 1, 1);
export { getEtfChart };
