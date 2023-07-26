/*
 * @Description: 处理用户选择
 * @Author: Sunly
 * @Date: 2023-07-25 08:18:49
 */
import { chat } from "./bot.js";
import { EnumEnvKey, setEnv } from "./env.js";
import {
  EnumErrorChoice,
  EnumMenuChoice,
  modelChoice,
  setBasePath,
} from "./menu.js";
import { printBye, printQuestion } from "./print.js";
import {
  generateChatToFile,
  userInputPassword,
  userInputMultiline,
} from "./utils.js";

const reduceMenuChoice = async (
  userSelect: EnumMenuChoice
): Promise<boolean> => {
  if (userSelect === EnumMenuChoice["EXIT"]) {
    printBye();
    process.exit();
  }

  if (userSelect === EnumMenuChoice["SET_KEY"]) {
    setEnv(EnumEnvKey.KEY, await userInputPassword("请输入Key: "));
    return false;
  } else if (userSelect === EnumMenuChoice["SET_MODEL"]) {
    setEnv(EnumEnvKey.MODEL, await modelChoice());
    return false;
  } else if (userSelect === EnumMenuChoice["SET_BASE_PATH"]) {
    setEnv(EnumEnvKey.BASE_PATH, await setBasePath());
    return false;
  } else if (userSelect === EnumMenuChoice["EXPORT_CHAT"]) {
    generateChatToFile();
    return false;
  } else if (userSelect === EnumMenuChoice["QUESTION"]) {
    return true;
  }
  return false;
};

const reduceErrorChoice = async (
  userSelect: EnumErrorChoice,
  question: string
) => {
  if (userSelect === EnumErrorChoice["EXIT"]) {
    printBye();
    process.exit();
  }

  if (userSelect === EnumErrorChoice["CHANGE_QUESTION"]) {
    const question = await userInputMultiline();
    printQuestion(question);
    await chat(question);
  } else if (userSelect === EnumErrorChoice["RESEND_REQUEST"]) {
    await chat(question);
  }
};

export { reduceMenuChoice, reduceErrorChoice };
