/*
 * @Description: 工具函数
 * @Author: Sunly
 * @Date: 2023-07-18 11:47:07
 */
import editor from "@inquirer/editor";
import { input, select } from "@inquirer/prompts";
import clipboardy from "clipboardy";
import dotEnv from "dotenv";
import fs from "fs";
import ora, { type Ora } from "ora";
import path from "path";
import process from "process";
import {
  printBye,
  printFailPreset,
  printSetPreset,
  printWelcome,
} from "./print.js";

// 用户输入
const userInput = async (message = "") => {
  return await input({ message });
};

// 用户多行输入
const userInputMultiline = async (message = "", waitForUseInput = false) => {
  return await editor({
    message,
    waitForUseInput,
  });
};

// 用户选择
const userSelect = async <T>(
  message: string,
  choices: { name: string; value: T; description?: string }[]
) => {
  return await select<T>({
    message,
    choices,
  });
};

// 动画
const createAnimation = (): string[] => {
  const sender = "💻";
  const receiver = "🌏";
  const animationArr: string[] = [];
  const emoji = shuffleArr([
    ["🦐", "🍤"],
    ["🥚", "🍳"],
    ["🐷", "🍖"],
    ["💣", "💥"],
    ["🔐", "🔓"],
    ["❎", "✅"],
    ["❓", "❗️"],
    ["➡️", "⬅️"],
    ["🌨️", "☂️"],
  ]);
  const animationLen = 24;
  const emptyChar = "─";
  emoji.forEach(([s, e]) => {
    for (let i = 0; i < animationLen; i++) {
      animationArr.push(
        `${sender}${emptyChar.repeat(i)}${s}${emptyChar.repeat(
          animationLen - i
        )}${receiver}`
      );
    }
    for (let i = 0; i < animationLen; i++) {
      animationArr.push(
        `${sender}${emptyChar.repeat(animationLen - i)}${e}${emptyChar.repeat(
          i
        )}${receiver}`
      );
    }
  });
  return animationArr;
};
let spinner: Ora;
let frames: string[];
const startLoading = () => {
  if (!frames) {
    frames = createAnimation();
  }
  spinner = ora({
    spinner: {
      interval: 120,
      frames,
    },
  }).start();
};
const stopLoading = () => {
  spinner.stop();
};

// 检查是否退出
const checkExit = (input: string) => {
  if (input === "bye" || input === "exit" || input === "quit") {
    printBye();
    process.exit();
  }
};

// 读取配置
const loadEnv = async () => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    await checkEnv();
    const preset = path.resolve(process.cwd(), ".preset");
    dotEnv.config({ path: preset, override: true });
    const { OPENAI_KEY, OPENAI_BASE_PATH, OPENAI_MODEL } = process.env;
    if (!OPENAI_KEY || !OPENAI_BASE_PATH || !OPENAI_MODEL) {
      printFailPreset();
      await userInput();
    } else {
      printWelcome(OPENAI_MODEL, OPENAI_BASE_PATH);
      break;
    }
  }
};
const checkEnv = async () => {
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
    await userInput();
  }
};

// 复制到剪贴板
const copyToClipboard = (text: string) => {
  clipboardy.writeSync(text);
};

const shuffleArr = <T>(arr: T[]): T[] => {
  let len = arr.length;
  let t;
  let i;
  while (len) {
    i = Math.floor(Math.random() * len--);
    t = arr[len];
    arr[len] = arr[i];
    arr[i] = t;
  }
  return arr;
};

export {
  checkExit,
  copyToClipboard,
  loadEnv,
  startLoading,
  stopLoading,
  userInput,
  userInputMultiline,
  userSelect,
};
