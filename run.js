import { execSync } from "child_process";
import fs from "fs";
import { getDateYMD } from "./src/utils/date.js";

const ymd = await getDateYMD();
const logFilePath = `./logs/${ymd}-execution.log`;

const fileList = [
  "fundCodeList.js",
  "fundDefaultInfo.js",
  "fundPortfolio.js",
  "fundProfit.js",
  "fundBasePrice.js",
];
try {
  // 로그 파일 초기화
  fs.writeFileSync(logFilePath, "");

  // 각 파일 실행 및 로그 기록
  const executeAndLog = (command, fileName) => {
    console.log(`${fileName} 파일을 실행합니다.`);
    const output = execSync(command).toString();
    console.log(`${fileName} 파일 실행 완료.`);
    fs.appendFileSync(
      logFilePath,
      `=== ${fileName} 실행 로그 ===\n${output}\n\n`
    );
  };

  for (let file of fileList) {
    executeAndLog(`node src/crawlers/${file}`, file);
  }

  console.log("모든 파일이 성공적으로 실행되었습니다.");
} catch (error) {
  console.error("파일 실행 중 오류가 발생하였습니다:", error);
}
