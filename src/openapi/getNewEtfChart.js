import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import { getAcessToken } from "../utils/accessToken.js";

const AppKey = process.env.KOREA_INVEST_APPKEY;
const SecretKey = process.env.KOREA_INVEST_SECRETKEY;
const AccessToken = await getAcessToken();

async function getNewEtfChart(stockCode, inputDate1, inputDate2) {
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
        fid_period_div_code: "W",
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

    const chartTemp = resp.data.output2
      .filter((item) => Object.keys(item).length !== 0)
      .map((item) => {
        return {
          주식영업일자: item.stck_bsop_date,
          주식종가: item.stck_clpr,
          누적거래량: item.acml_vol,
        };
      });

    const chartResult = {
      HTS한글종목명: resp.data.output1.hts_kor_isnm,
      시가총액: resp.data.output1.hts_avls,
      전일거래량: resp.data.output1.prdy_vol,
      chart: chartTemp,
    };
    console.log(chartResult);
    return chartResult;
  } catch (error) {
    throw error;
  }
}

export { getNewEtfChart };
