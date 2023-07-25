/*
 * @Description: 工具函数
 * @Author: Sunly
 * @Date: 2023-07-18 11:47:07
 */
import editor from "@inquirer/editor";
import password from "@inquirer/password";
import { input, select, Separator } from "@inquirer/prompts";
import clipboardy from "clipboardy";
import dayjs from "dayjs";
import fs from "fs";
import ora, { type Ora } from "ora";
import path from "path";
import process from "process";
import { EnumRole, getMessages } from "./messages.js";
import { printAnswer, printBye } from "./print.js";

// 用户输入
const userInput = async (message = "") => {
  return await input({ message });
};

// 用户输入密码
const userInputPassword = async (message = "") => {
  return await password({ message, mask: true });
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
  choices: (
    | { name: string; value: T; description?: string; disabled?: string }
    | Separator
  )[]
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

// 复制到剪贴板
const copyToClipboard = (text: string) => {
  clipboardy.writeSync(text);
};

// 随机数组
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

// 生成对话到文件
const generateChatToFile = () => {
  const messages = getMessages();
  const getRole = (role: EnumRole) => {
    return role === EnumRole.SYSTEM
      ? "角色信息"
      : role === EnumRole.USER
      ? "我"
      : "ChatGPT";
  };
  const chat = messages.reduce((pre, { content, role }) => {
    return (pre += `#### ${getRole(role)}:\n${content}\n`);
  }, "");
  const chatFilePath = path.resolve(
    process.cwd(),
    `chat-${dayjs().format("YYYY-MM-DD-HH-mm-ss")}.md`
  );
  fs.writeFileSync(chatFilePath, chat, {
    encoding: "utf-8",
  });
  printAnswer(`对话已保存到 ${chatFilePath}`);
};

export {
  checkExit,
  copyToClipboard,
  generateChatToFile,
  startLoading,
  stopLoading,
  userInput,
  userInputMultiline,
  userInputPassword,
  userSelect,
};
