import figlet from "figlet";
import cliProgress from "cli-progress";
import { SingleBar } from "cli-progress";

// 텍스트 배너
export async function figletAsync(text) {
  return new Promise((resolve, reject) => {
    figlet(text, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

// 프로그레스 바
export const progressBar = new SingleBar(
  {
    stopOnComplete: true,
  },
  cliProgress.Presets.shades_classic
);
