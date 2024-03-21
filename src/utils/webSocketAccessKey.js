import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const AccessKey = process.env.KOREA_INVEST_APPKEY;
const SecretKey = process.env.KOREA_INVEST_SECRETKEY;

async function getSocketAcessKey() {
  const url = "https://openapivts.koreainvestment.com:29443";
  const PATH = "/oauth2/Approval";
  const baseURL = url + PATH;
  try {
    const resp = await axios.post(
      baseURL,
      {
        grant_type: "client_credentials",
        appkey: AccessKey,
        secretkey: SecretKey,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("resp.data:", resp.data);
    return resp.data;
  } catch (error) {
    console.log("error: " + error.message);
  }
}

getSocketAcessKey();
