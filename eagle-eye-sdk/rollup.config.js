import path from 'path';
import resolve from 'rollup-plugin-node-resolve'
import ts from 'rollup-plugin-typescript2';
import babel from 'rollup-plugin-babel';
// import { uglify } from 'rollup-plugin-uglify';
import { terser } from "rollup-plugin-terser";

const getPath = _path => path.resolve(__dirname, _path)
const extensions = [
  '.js',
  '.ts',
]

// ts
const tsPlugin = ts({
  tsconfig: getPath('./tsconfig.json'), // 导入本地ts配置
  extensions
})


export default {
  input: './src/index.ts',
  output: {
    file: './lib/eagle-eye.js',
    format: 'umd',
    name: "eagleSDK",
  },
  plugins:[
    resolve(extensions),
    tsPlugin,
    babel({
      exclude: 'node_modules/**'
    }),
    terser(),
  ]
};