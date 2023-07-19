/*
 * @Description: rollup配置文件
 * @Author: Sunly
 * @Date: 2023-07-19 02:30:16
 */
import { nodeResolve } from "@rollup/plugin-node-resolve";
import rollupCommonJS from "@rollup/plugin-commonjs";
import rollupJson from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: {
    file: "bundle/index.js",
    format: "cjs",
  },

  external: [],
  plugins: [
    rollupCommonJS(),
    nodeResolve({
      exportConditions: ["node"],
    }),
    typescript({
      tsconfig: "tsconfig.json",
    }),
    rollupJson(),
  ],
};
