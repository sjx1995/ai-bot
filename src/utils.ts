/*
 * @Description: loading动画
 * @Author: Sunly
 * @Date: 2023-07-18 11:47:07
 */
import ora, { type Ora } from "ora";
import dotEnv from "dotenv";
import path from "path";
import url from "url";
import { printAnswer } from "./print.js";

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
  const curPath = url.fileURLToPath(import.meta.url);
  const preset = path.resolve(curPath, "../../.preset");
  dotEnv.config({ path: preset });
};

export { startLoading, stopLoading, checkExit, loadEnv };
