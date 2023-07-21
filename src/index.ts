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
  loadEnv,
  userInputMultiline,
} from "./utils.js";
import { menuChoice, setSystemChoice, enumSystemChoice } from "./menu.js";

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
    const systemChoice = await setSystemChoice();
    if (systemChoice === enumSystemChoice["YES"] || systemChoice === false) {
      // 目前只有一种输出 QUESTION
      // todo 未来可以增加多种输出
      await menuChoice();
    }
    // 用户输入
    const question = await userInputMultiline();
    printQuestion(question);

    // 请求openai
    startLoading();
    const answer = await requestOpenAI(question);
    stopLoading();
    printAnswer(answer);
  }
}

main();
