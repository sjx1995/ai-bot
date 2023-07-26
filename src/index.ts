/*
 * @Description: index
 * @Author: Sunly
 * @Date: 2023-07-18 06:21:29
 */
import { chat } from "./bot.js";
import { EnumSystemChoice, menuChoice, setSystemChoice } from "./menu.js";
import { printQuestion, printWelcome } from "./print.js";
import { reduceMenuChoice } from "./reduce.js";
import { userInputMultiline } from "./utils.js";

async function main() {
  printWelcome();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // 读取配置
    const isStartCompletion = await reduceMenuChoice(await menuChoice());
    if (!isStartCompletion) {
      continue;
    }

    // 第一次设置system
    const systemChoiceRes = await setSystemChoice();
    if (systemChoiceRes === EnumSystemChoice["YES"]) {
      continue;
    }

    // 用户输入
    const question = await userInputMultiline();
    printQuestion(question);

    await chat(question);
    // 请求openai
  }
}

main();
