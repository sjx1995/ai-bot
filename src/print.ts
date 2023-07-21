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
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore 开启resolveJsonModule后打包会报错
import pkg from "../package.json";

marked.setOptions({
  renderer: new markedTerminal() as never,
  mangle: false,
  headerIds: false,
});

const printQuestion = (input: string) => {
  console.log(
    chalk.hex(QUESTION_COLOR)(
      `─ 🤔 我 ${`─`.repeat(Math.max(process.stdout.columns - 8, 0))}`
    )
  );
  console.log(marked(input));
};

const printAnswer = (input: string) => {
  console.log(
    chalk.hex(ANSWER_COLOR)(
      `─ 💡 ChatGPT ${`─`.repeat(Math.max(process.stdout.columns - 13, 0))}`
    )
  );
  console.log(marked(input));
};

const baseBoxen = (
  text: string,
  title: string,
  borderColor: string,
  Options: Options = {}
) => {
  console.log(
    boxen(
      marked(text),
      Object.assign(
        {},
        {
          float: "left",
          borderStyle: "round",
          padding: {
            top: 0,
            bottom: 0,
            left: 1,
            right: 1,
          },
        },
        { ...Options },
        { title, borderColor }
      )
    )
  );
};

const printSystemRole = (message: string) => {
  baseBoxen(marked(message), "😏 角色信息", ANSWER_COLOR);
};

const printBye = () => {
  baseBoxen("ByeBye~ 👋", "💡 OpenAI", ANSWER_COLOR);
};

const printWelcome = (model: string, basePath: string) => {
  baseBoxen(
    marked(
      // `🌐 请求地址: ${basePath}\n🤖 模型: ${model}`
      `🌈 版本: ${pkg.version}\n🌐 请求地址: ${basePath}\n🤖 模型: ${model}`
    ),
    "✨ 欢迎使用",
    ANSWER_COLOR
  );
};

const printSetPreset = () => {
  baseBoxen(
    marked(
      `配置文件 .preset 已生成，请填入打开文件根据注释填入对应的值\n回车重新检查配置文件`
    ),
    "✅ 生成配置文件",
    ANSWER_COLOR
  );
};

const printFailPreset = () => {
  baseBoxen(
    marked(
      `配置文件不正确或缺少对应的值，请检查 .preset 文件或者删除以重新生成\n回车重新检查配置文件`
    ),
    "😥 读取配置文件失败",
    ANSWER_COLOR
  );
};

const printSuccessMessage = (message: string) => {
  console.log(`✅ ${message}`);
};

export {
  printQuestion,
  printAnswer,
  printBye,
  printWelcome,
  printSetPreset,
  printFailPreset,
  printSuccessMessage,
  printSystemRole,
};
