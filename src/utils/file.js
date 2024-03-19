import fs from "fs";
import path from "path";

const dataPath = "./data";

export const fileNames = {
  fundList: "fund-list.json",
};

export async function readJson(fileName) {
  try {
    console.log(path.join(dataPath, fileName));
    const jsonFile = fs.readFileSync(path.join(dataPath, fileName), "utf8");
    return JSON.parse(jsonFile);
  } catch (error) {
    console.error(`\nError read jason file: ${fileName}`, error.message);
    return null;
  }
}

export async function saveJson(fileName, data) {
  try {
    if (!fs.existsSync(dataPath)) {
      fs.mkdirSync(dataPath);
    }
    fs.writeFileSync(path.join(dataPath, fileName), JSON.stringify(data));
    console.log(`\nData saved Successfully: ${fileName}`);
  } catch (error) {
    console.error(`\nError saving json data: ${fileName}`, error.message);
    return null;
  }
}
