/*
 * @Description: ai机器人
 * @Author: Sunly
 * @Date: 2023-07-18 11:26:00
 */
import {
  Configuration,
  OpenAIApi,
  type ChatCompletionRequestMessage,
  type ConfigurationParameters,
} from "openai";
import { EnumEnvKey } from "./env.js";
import { errorChoice } from "./menu.js";
import { addAnswer, addQuestion, getMessages } from "./messages.js";
import { printAnswer, printError } from "./print.js";
import { reduceErrorChoice } from "./reduce.js";
import { outputErrorFile, startLoading, stopLoading } from "./utils.js";

let openai: OpenAIApi;

const createOenAI = () => {
  if (openai) return;

  const config: ConfigurationParameters = {
    apiKey: process.env[EnumEnvKey.KEY],
  };
  if (process.env[EnumEnvKey.BASE_PATH]) {
    config.basePath = process.env[EnumEnvKey.BASE_PATH];
  }
  const configuration = new Configuration(config);

  openai = new OpenAIApi(configuration);
};

const requestOpenAI = async (message: string): Promise<[boolean, string]> => {
  addQuestion(message);
  createOenAI();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  try {
    const chatCompletion = await openai.createChatCompletion({
      model: process.env[EnumEnvKey.MODEL]!,
      messages: getMessages() as ChatCompletionRequestMessage[],
    });
    const answer = chatCompletion.data.choices[0].message?.content ?? "";
    addAnswer(answer);
    return [true, answer];
  } catch (error) {
    const ERR_FILE_PATH = outputErrorFile(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = (error as any).response;
    let errMsg = response?.data.message ?? response?.data ?? "未知错误";
    errMsg = typeof errMsg === "string" ? errMsg : JSON.stringify(errMsg);
    return [false, `${errMsg}\n\n错误日志保存到: ${ERR_FILE_PATH}`];
  }
};

const chat = async (question: string) => {
  startLoading();
  const [isReqSuc, answer] = await requestOpenAI(question);
  stopLoading();

  if (isReqSuc) {
    return printAnswer(answer);
  }

  printError(answer);
  await reduceErrorChoice(await errorChoice(), question);
};

export { chat };
