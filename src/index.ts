/*
 * @Description: index
 * @Author: Sunly
 * @Date: 2023-07-18 06:21:29
 */
import { printAnswer, printQuestion } from "./print.js";
import { requestOpenAI } from "./bot.js";
import {
  startLoading,
  stopLoading,
  checkExit,
  loadEnv,
  userInput,
} from "./utils.js";
import { setSystemChoice } from "./menu.js";

let isCheck = false;

async function main() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // 读取配置
    if (!isCheck) {
      await loadEnv();
      isCheck = true;
    }

    // 第一次设置system
    await setSystemChoice();

    // 用户输入
    printQuestion();
    const question = (await userInput()).trim();

    // 检查输入
    checkExit(question);
    // if (question === "/menu") {
    //   await menuChoice();
    //   continue;
    // }

    // 请求openai
    startLoading();
    const answer = await requestOpenAI(question);
    stopLoading();
    printAnswer(answer);
  }
}

main();
