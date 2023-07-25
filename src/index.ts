/*
 * @Description: index
 * @Author: Sunly
 * @Date: 2023-07-18 06:21:29
 */
import { printAnswer, printQuestion, printWelcome } from "./print.js";
import { requestOpenAI } from "./bot.js";
import { startLoading, stopLoading, userInputMultiline } from "./utils.js";
import { menuChoice, setSystemChoice, EnumSystemChoice } from "./menu.js";
import { reduceMenuChoice } from "./reduce.js";

// let isCheck = false;

async function main() {
  printWelcome();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // 读取配置
    const isStartCompletion = await reduceMenuChoice(await menuChoice());
    if (!isStartCompletion) {
      continue;
    }

    // if (!isCheck) {
    //   await loadEnv();
    //   isCheck = true;
    // }

    // 第一次设置system
    const systemChoiceRes = await setSystemChoice();
    if (
      systemChoiceRes === EnumSystemChoice["YES"] ||
      systemChoiceRes === false
    ) {
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
