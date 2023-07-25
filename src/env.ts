/*
 * @Description: 环境变量相关
 * @Author: Sunly
 * @Date: 2023-07-25 08:33:47
 */
import dotEnv from "dotenv";
import fs from "fs";
import path from "path";

const ENV_PATH = path.resolve(process.cwd(), ".preset");
enum EnumEnvKey {
  KEY = "OPENAI_KEY",
  BASE_PATH = "OPENAI_BASE_PATH",
  MODEL = "OPENAI_MODEL",
}

// 判断配置文件是否存在
const isExistEnvFile = (): boolean => fs.existsSync(ENV_PATH);

// 创建配置文件
const createEnvFile = (key = "", basePath = "", model = "gpt-3.5-turbo") => {
  fs.writeFileSync(
    path.resolve(process.cwd(), ".preset"),
    "# openai key\n" +
      `${EnumEnvKey["KEY"]}=${key}\n\n` +
      "# 需要修改对应的请求地址，空值表示官方地址\n" +
      `${EnumEnvKey["BASE_PATH"]}=${basePath}\n\n` +
      "# 官方模型允许值：gpt-4, gpt-4-0613, gpt-4-32k, gpt-4-32k-0613, gpt-3.5-turbo, gpt-3.5-turbo-0613, gpt-3.5-turbo-16k, gpt-3.5-turbo-16k-0613\n" +
      `${EnumEnvKey["MODEL"]}=${model}\n`,
    { encoding: "utf-8" }
  );
};

// 获取配置
// 对象类型键是枚举EnumEnvKey,值是string
// : {
// [key in EnumEnvKey]: string;
// }
const getEnv = (): {
  [keyof in EnumEnvKey]: string;
} => {
  if (!isExistEnvFile) {
    createEnvFile();
  }
  dotEnv.config({ path: ENV_PATH, override: true });
  return {
    [EnumEnvKey.KEY]: process.env[EnumEnvKey.KEY]!,
    [EnumEnvKey.BASE_PATH]: process.env[EnumEnvKey.BASE_PATH]!,
    [EnumEnvKey.MODEL]: process.env[EnumEnvKey.MODEL]!,
  };
};

// 检查配置是否合法
const checkEnv = (): boolean => {
  const { OPENAI_KEY, OPENAI_MODEL } = getEnv();
  return !!(OPENAI_KEY && OPENAI_MODEL);
};

// 设置环境变量
const setEnv = (key: EnumEnvKey, value: string) => {
  if (!isExistEnvFile()) {
    createEnvFile();
  }
  const env = dotEnv.parse(fs.readFileSync(ENV_PATH)) as {
    [keyof in EnumEnvKey]: string;
  };
  env[key] = value;
  createEnvFile(
    env[EnumEnvKey.KEY],
    env[EnumEnvKey.BASE_PATH],
    env[EnumEnvKey.MODEL]
  );
  dotEnv.config({ path: ENV_PATH, override: true });
};

export { checkEnv, getEnv, setEnv, EnumEnvKey };
