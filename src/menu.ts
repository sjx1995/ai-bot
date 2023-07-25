/*
 * @Description: 用户菜单
 * @Author: Sunly
 * @Date: 2023-07-20 08:19:58
 */
import { getEnv } from "./env.js";
import { addSystem, getMessages } from "./messages.js";
import { printSystemRole } from "./print.js";
import { userInput, userInputMultiline, userSelect } from "./utils.js";

// 菜单
enum EnumMenuChoice {
  QUESTION = "question",
  EXIT = "exit",
  SET_BASE_PATH = "set_base_path",
  SET_MODEL = "set_model",
  SET_KEY = "set_key",
  EXPORT_CHAT = "export_chat",
}

const menuChoice = async () => {
  const { OPENAI_BASE_PATH, OPENAI_KEY, OPENAI_MODEL } = getEnv();
  const createMenu = () => {
    const baseMenu = [
      {
        name: `${OPENAI_KEY ? "修改" : "设置"}key (${
          OPENAI_KEY
            ? "已设置: " + "*".repeat(24) + OPENAI_KEY.slice(-6)
            : "未设置"
        })`,
        value: EnumMenuChoice["SET_KEY"],
      },
      {
        name: `${OPENAI_MODEL ? "修改" : "设置"}模型 (${
          OPENAI_MODEL ? "已设置: " + OPENAI_MODEL : "未设置"
        })`,
        value: EnumMenuChoice["SET_MODEL"],
      },
      {
        name: `修改请求地址 (已设置: ${
          OPENAI_BASE_PATH ? OPENAI_BASE_PATH : "官方地址"
        })`,
        value: EnumMenuChoice["SET_BASE_PATH"],
      },
      {
        name: "退出程序",
        value: EnumMenuChoice["EXIT"],
      },
    ];
    if (getMessages().length > 1) {
      baseMenu.unshift({
        name: "保存对话到文件",
        value: EnumMenuChoice["EXPORT_CHAT"],
      });
    }
    if (OPENAI_MODEL && OPENAI_KEY) {
      baseMenu.unshift({
        name: getMessages().length > 1 ? "继续对话" : "开始对话",
        value: EnumMenuChoice["QUESTION"],
      });
    }
    return baseMenu;
  };
  const menuSelect = await userSelect<EnumMenuChoice>("⚙️ 菜单", createMenu());

  return menuSelect;
};

// 模型
enum EnumModelName {
  "gpt-3.5-turbo" = "gpt-3.5-turbo",
  "gpt-3.5-turbo-16k" = "gpt-3.5-turbo-16k",
  "gpt-4" = "gpt-4",
}
const modelChoice = async (): Promise<EnumModelName> => {
  const modelSelect = await userSelect<EnumModelName>(
    "请选择模型: ",
    Object.keys(EnumModelName).map((key) => ({
      name: key,
      value: EnumModelName[key as keyof typeof EnumModelName],
    }))
  );
  return modelSelect;
};

// 是否使用官方请求地址
const setBasePath = async (): Promise<string> => {
  const isOfficialSelect = await userSelect("使用官方请求地址？", [
    { name: "是", value: true },
    { name: "否，我是第三方key，需要修改请求地址", value: false },
  ]);
  return isOfficialSelect ? "" : await userInput("请输入请求地址: ");
};

// 第一次提示用户是否要设置system
enum EnumSystemChoice {
  YES = "yes",
  NO = "no",
  AUTO = "auto",
}

let isSetSystem = false;
const setSystemChoice = async (): Promise<false | EnumSystemChoice> => {
  if (isSetSystem) return false;

  const systemSelect = await userSelect(
    "👨‍💻 你可以在提问前设置ai角色，是否设置？如果你不需要设置，点击否可以直接开始对话。",
    [
      { name: "是，设置并作为system发送", value: EnumSystemChoice["YES"] },
      {
        name: "否，直接开始对话",
        value: EnumSystemChoice["NO"],
      },
      {
        name: "自动设置，这将和第一次提问内容相同",
        value: EnumSystemChoice["AUTO"],
      },
    ]
  );

  if (systemSelect === EnumSystemChoice["YES"]) {
    const systemInfo = await userInputMultiline("请输入你想设置的system内容：");
    addSystem(systemInfo, false);
    printSystemRole(systemInfo);
  } else if (systemSelect === EnumSystemChoice["NO"]) {
    addSystem("", false);
  } else if (systemSelect === EnumSystemChoice["AUTO"]) {
    addSystem("", true);
  }
  isSetSystem = true;
  return systemSelect;
};

export {
  EnumMenuChoice,
  EnumSystemChoice,
  menuChoice,
  setSystemChoice,
  modelChoice,
  EnumModelName,
  setBasePath,
};
