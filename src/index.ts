/*
 * @Description: index
 * @Author: Sunly
 * @Date: 2023-07-18 06:21:29
 */
import readline from "readline-sync";
import { printAnswer, printQuestion } from "./print.js";
import { requestOpenAI } from "./bot.js";
import { startLoading, stopLoading, checkExit, loadEnv } from "./utils.js";

async function main() {
  while (true) {
    loadEnv();
    printQuestion();
    const inputMessage = readline.question();
    checkExit(inputMessage);
    startLoading("Thinking...");
    const answer = await requestOpenAI(inputMessage);
    stopLoading();
    printAnswer(answer);
  }
}

main();
