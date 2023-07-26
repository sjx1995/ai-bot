/*
 * @Description: 解析JSON
 * @Author: Sunly
 * @Date: 2023-07-26 10:54:59
 */
import { parse } from "flatted";
import fs from "fs";
// 填写对应文件路径
const file = fs.readFileSync("./error-2023-07-26-10-58-48.json", "utf-8");

console.log(parse(file));
