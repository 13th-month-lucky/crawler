import axios from "axios";
import { getDateSDT } from "../utils/date.js";
import { connectDB, disconnectDB } from "../utils/database.js";
import { figletAsync, progressBar } from "../utils/visualization.js";
import { Fund } from "../models/Fund.js";
import { randomDelay } from "../utils/delay.js";

const url =
  "https://www.shinhansec.com/siw/wealth-management/fund/59900101/data.do";

// 펀드 상세 페이지 - 기본 정보 전체 response 반환
async function fetchFundDefaultInfoPage(fundCode) {
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
        rateTabIndex: "tab1",
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

// 기본 정보 생성
async function getFundDefaultInfo(fundCode) {
  const response = await fetchFundDefaultInfoPage(fundCode);
  const bodyData = response.data.body;
  let fundInfo = {};
  if (bodyData) {
    let target = bodyData.data2;
    if (target) {
      fundInfo = {
        펀드코드: target["펀드코드"],
        펀드명: target["펀드명"],
        상품코드: target["신한펀드코드"],
        기준가: target["기준가"],
        규모: target["순자산"] + "억원",
        클래스명: target["펀드평가사클래스명"],
        설정일: target["설정일"],
        운용사: target["운용사"],
        보수: target["총보수"],
        상품_유형: target["펀드유형"],
        모닝스타_등급: target["모닝스타 펀드등급"],
        통화_단위: target["통화단위"],
        판매_채널: target["온라인전용"],
      };
    }

    target = bodyData.data4;

    if (target) {
      fundInfo = {
        ...fundInfo,
        위험등급: target["펀드위험등급"],
        등락: target["등락"],
        특징: target["펀드특징"],
        운용전략: target["운용전략"],
      };
    }

    target = bodyData.data5;
    if (target) {
      // 가입 대상 설정
      let 가입대상 = "";
      if (target["개인"] === "Y") {
        가입대상 = "개인";
      } else if (target["법인"] === "Y") {
        가입대상 = "법인";
      } else if (target["외국인"] === "Y") {
        가입대상 = "외국인";
      }

      // 과세 종류 설정
      let 과세종류 = "";
      if (target["일반과세여부"] === "Y") {
        과세종류 = "일반과세";
      } else if (target["세금우대여부"] === "Y") {
        과세종류 = "세금우대";
      } else if (target["비과세여부"] === "Y") {
        과세종류 = "비과세";
      }

      // 가입 유형 설정
      let 가입유형 = "";
      if (target["임의식"] === "Y") {
        가입유형 = "임의식";
      } else if (target["거치식"] === "Y") {
        가입유형 = "거치식";
      } else if (target["정액적립식"] === "Y") {
        가입유형 = "정액적립식";
      } else if (target["자유적립식"] === "Y") {
        가입유형 = "자유적립식";
      }

      // 판매 채널 설정
      let 판매채널 = "";
      if (target["온라인판매"] === "Y") {
        판매채널 = "온라인";
      } else if (target["영업점판매"] === "Y") {
        판매채널 = "지점";
      } else if (target["전화"] === "Y") {
        판매채널 = "전화";
      }

      fundInfo = {
        ...fundInfo,
        판매수수료: target["수수료1"] == "" ? "없음" : target["수수료1"],
        환매수수료: target["수수료2"] == "" ? "없음" : target["수수료2"],
        모집방식: target["구분"],
        과세종류: 과세종류,
        환매방식: target["환매방식"],
        가입유형: 가입유형,
        최소_가입_금액:
          target["개인"] == "1" ? "제한없음" : target["개인"] + "원",
        적립식_최소_투자_기간: target["최소투자기간"], // TODO: 공백 제거할 것인지?
        투자지역: target["투자지역"],
        투자국가: target["투자국가"],
        환헤지: target["환헷지"],
        가입_대상: 가입대상,
        해외_주식_비과세: target["해외주식비과세"],
      };
    }
  }
  return fundInfo;
}

async function run() {
  const figletData = await figletAsync("Fund Default Info");
  console.log(figletData);

  try {
    await connectDB();

    // 1. DB에서 모든 코드를 가져온다.
    const fundCodes = await Fund.getAllCodes();
    let fundCode;

    // 2. 반복문 돌려서 업데이트 한다.
    progressBar.start(fundCodes.length, 0);
    for (fundCode of fundCodes) {
      await randomDelay(2);
      // 기본 정보
      const defaultInfo = await getFundDefaultInfo(fundCode);
      await Fund.updateOne(
        { code: fundCode },
        { $set: { data: defaultInfo } }
      ).then((data) => {
        // DB 업데이트
        progressBar.increment();
      });
    }
  } catch (e) {
    console.log(`====== Error in ${fundCode} =======`);
    console.error(e);
    console.log();
  } finally {
    await disconnectDB();
  }
}

run();
