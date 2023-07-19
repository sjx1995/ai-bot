/*
 * @Description: ai机器人
 * @Author: Sunly
 * @Date: 2023-07-18 11:26:00
 */
import { Configuration, OpenAIApi } from "openai";
import { addAnswer, addQuestion, getMessages } from "./messages.js";

let openai: OpenAIApi;

const createOenAI = () => {
  if (openai) return;

  const configuration = new Configuration({
    apiKey: process.env["OPENAI_KEY"],
    basePath: process.env["OPENAI_BASE_PATH"],
    // basePath: "https://api.openai.com/v1",
  });

  openai = new OpenAIApi(configuration);
};

const requestOpenAI = async (message: string) => {
  addQuestion(message);

  createOenAI();
  const chatCompletion = await openai.createChatCompletion({
    model: process.env["OPEN_AI_MODEL"] as string,
    messages: getMessages(),
  });
  const answer = chatCompletion.data.choices[0].message?.content!;

  addAnswer(answer);

  return answer;
};

export { requestOpenAI };
