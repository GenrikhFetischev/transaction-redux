const commonjs = require("rollup-plugin-commonjs");
const json = require("@rollup/plugin-json");
const resolve = require("rollup-plugin-node-resolve");
const external = require("rollup-plugin-peer-deps-external");
const sourcemaps = require("rollup-plugin-sourcemaps");
// const { terser } = require("rollup-plugin-terser");
const typescript = require("rollup-plugin-typescript2");
const url = require("rollup-plugin-url");

module.exports = {
  input: "src/index.ts",
  output: [
    {
      file: "lib/index.cjs.js",
      format: "cjs",
      sourcemap: true
    },
    {
      file: "lib/index.esm.js",
      format: "esm",
      sourcemap: true
    }
  ],
  plugins: [
    external({
      includeDependencies: true
    }),
    url(),
    sourcemaps(),
    json(),
    resolve(),
    commonjs(),
    typescript({
      objectHashIgnoreUnknownHack: true,
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: { noEmitHelpers: true },
        exclude: ["**/__tests__", "**/__fixtures__"]
      }
    }),
    // terser()
  ]
};
