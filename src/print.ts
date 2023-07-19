/*
 * @Description: 控制台打印
 * @Author: Sunly
 * @Date: 2023-07-18 11:08:34
 */
import boxen, { type Options } from "boxen";
import chalk from "chalk";
import { QUESTION_COLOR, ANSWER_COLOR } from "./constant.js";
import { marked } from "marked";
import markedTerminal from "marked-terminal";

marked.setOptions({
  renderer: new markedTerminal() as any,
  mangle: false,
  headerIds: false,
});

const printQuestion = () => {
  console.log(
    chalk.hex(QUESTION_COLOR)(
      `─ 🤔 请输入问题 ${`─`.repeat(Math.max(process.stdout.columns - 16, 0))}`
    )
  );
};

const baseBoxenOptions: Options = {
  float: "left",
  borderStyle: "round",
  padding: {
    top: 0,
    bottom: 0,
    left: 1,
    right: 1,
  },
};

const printAnswer = (input: string) => {
  console.log(
    boxen(
      marked(input),
      Object.assign({}, baseBoxenOptions, {
        title: "💡 OpenAI",
        borderColor: ANSWER_COLOR,
      })
    )
  );
};

export { printQuestion, printAnswer };
