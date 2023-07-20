/*
 * @Description: 用户菜单
 * @Author: Sunly
 * @Date: 2023-07-20 08:19:58
 */
import { getLastAnswer, addSystem } from "./messages.js";
import { printBye, printSuccessMessage } from "./print.js";
import { copyToClipboard, userInput, userSelect } from "./utils.js";

// 菜单
enum EnumMenuChoice {
  COPY = "copy",
  CLOSE = "close",
  EXIT = "exit",
}

const menuChoice = async () => {
  const menuSelect = await userSelect<EnumMenuChoice>("⚙️ 菜单", [
    { name: "复制上一条回答", value: EnumMenuChoice["COPY"] },
    { name: "关闭菜单", value: EnumMenuChoice["CLOSE"] },
    { name: "退出程序", value: EnumMenuChoice["EXIT"] },
  ]);

  if (menuSelect === EnumMenuChoice["COPY"]) {
    const lastAnswer = getLastAnswer();
    if (lastAnswer) {
      console.log(lastAnswer);
      copyToClipboard(lastAnswer);
      printSuccessMessage("已复制到剪贴板");
    }
  } else if (menuSelect === EnumMenuChoice["CLOSE"]) {
    return;
  } else if (menuSelect === EnumMenuChoice["EXIT"]) {
    printBye();
    process.exit();
  }
};

// 第一次提示用户是否要设置system
enum enumSystemChoice {
  YES = "yes",
  NO = "no",
  AUTO = "auto",
}

let isSetSystem = false;
const setSystemChoice = async () => {
  if (isSetSystem) return;

  const systemSelect = await userSelect(
    "👨‍💻 你可以在提问前设置ai角色，是否设置？如果你不需要设置，点击否可以直接开始对话。",
    [
      { name: "是，设置并作为system发送", value: enumSystemChoice["YES"] },
      { name: "否，直接开始对话", value: enumSystemChoice["NO"] },
      {
        name: "自动设置，这将和第一次提问内容相同",
        value: enumSystemChoice["AUTO"],
      },
    ]
  );

  if (systemSelect === enumSystemChoice["YES"]) {
    const systemInfo = await userInput("请输入你想设置的system内容：");
    addSystem(systemInfo, false);
  } else if (systemSelect === enumSystemChoice["NO"]) {
    addSystem("", false);
  } else if (systemSelect === enumSystemChoice["AUTO"]) {
    addSystem("", true);
  }
  isSetSystem = true;
};

export { menuChoice, setSystemChoice };
