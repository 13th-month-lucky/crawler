import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const AccessKey = process.env.KOREA_INVEST_APPKEY;
const SecretKey = process.env.KOREA_INVEST_SECRETKEY;

async function getAcessToken() {
  const url = "https://openapivts.koreainvestment.com:29443";
  const PATH = "/oauth2/tokenP";
  const baseURL = url + PATH;
  try {
    const resp = await axios.post(
      baseURL,
      {
        grant_type: "client_credentials",
        appkey: AccessKey,
        appsecret: SecretKey,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(resp.data.access_token);
    return resp.data.access_token;
  } catch (error) {
    console.log("error2: " + error.message);
  }
}
getAcessToken();
export { getAcessToken };
