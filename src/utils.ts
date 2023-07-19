/*
 * @Description: loading动画
 * @Author: Sunly
 * @Date: 2023-07-18 11:47:07
 */
import ora, { type Ora } from "ora";
import dotEnv from "dotenv";
import path from "path";
import fs from "fs";
import process from "process";
import {
  printAnswer,
  printFailPreset,
  printSetPreset,
  printWelcome,
} from "./print.js";

let spinner: Ora;
const startLoading = (text: string) => {
  spinner = ora(`${text}\n`).start();
};
const stopLoading = () => {
  spinner.stop();
};

const checkExit = (input: string) => {
  if (input === "bye" || input === "exit" || input === "quit") {
    printAnswer("ByeBye~ 👋");
    process.exit();
  }
};

const loadEnv = () => {
  checkEnv();
  const preset = path.resolve(process.cwd(), ".preset");
  dotEnv.config({ path: preset });
  const { OPENAI_KEY, OPENAI_BASE_PATH, OPENAI_MODEL } = process.env;
  if (!OPENAI_KEY || !OPENAI_BASE_PATH || !OPENAI_MODEL) {
    printFailPreset();
    process.exit();
  }
  printWelcome(OPENAI_MODEL, OPENAI_BASE_PATH);
};

const checkEnv = () => {
  if (!fs.existsSync(path.resolve(process.cwd(), ".preset"))) {
    fs.writeFileSync(
      path.resolve(process.cwd(), ".preset"),
      "# 在等号后面填入你的openai key\n" +
        "OPENAI_KEY=\n\n" +
        "# 如果是第三方key，需要修改对应的请求地址\n" +
        "OPENAI_BASE_PATH=https://api.openai.com/v1\n\n" +
        "# 模型允许值：gpt-4, gpt-4-0613, gpt-4-32k, gpt-4-32k-0613, gpt-3.5-turbo, gpt-3.5-turbo-0613, gpt-3.5-turbo-16k, gpt-3.5-turbo-16k-0613\n" +
        "OPENAI_MODEL=gpt-3.5-turbo\n",
      { encoding: "utf-8" }
    );
    printSetPreset();
    process.exit();
  }
};

export { startLoading, stopLoading, checkExit, loadEnv };
