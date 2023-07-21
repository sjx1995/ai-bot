/*
 * @Description: 用户菜单
 * @Author: Sunly
 * @Date: 2023-07-20 08:19:58
 */
import { addSystem } from "./messages.js";
import { printBye, printSystemRole } from "./print.js";
import { userInputMultiline, userSelect } from "./utils.js";

// 菜单
enum EnumMenuChoice {
  QUESTION = "question",
  EXIT = "exit",
}

let isFirstMenu = true;
const menuChoice = async () => {
  const menuSelect = await userSelect<EnumMenuChoice>(
    // "⚙️ 菜单"
    "",
    [
      {
        name: isFirstMenu ? "开始提问" : "继续提问",
        value: EnumMenuChoice["QUESTION"],
      },
      { name: "退出程序", value: EnumMenuChoice["EXIT"] },
    ]
  );
  isFirstMenu = false;

  if (menuSelect === EnumMenuChoice["EXIT"]) {
    printBye();
    process.exit();
  }

  return menuSelect;
};

// 第一次提示用户是否要设置system
enum enumSystemChoice {
  YES = "yes",
  NO = "no",
  AUTO = "auto",
}

let isSetSystem = false;
const setSystemChoice = async (): Promise<false | enumSystemChoice> => {
  if (isSetSystem) return false;

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
    const systemInfo = await userInputMultiline("请输入你想设置的system内容：");
    addSystem(systemInfo, false);
    printSystemRole(systemInfo);
  } else if (systemSelect === enumSystemChoice["NO"]) {
    addSystem("", false);
  } else if (systemSelect === enumSystemChoice["AUTO"]) {
    addSystem("", true);
  }
  isSetSystem = true;
  return systemSelect;
};

export { menuChoice, EnumMenuChoice, setSystemChoice, enumSystemChoice };
