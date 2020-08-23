/*
 * @Author: Jonath
 * @Date: 2020-08-06 00:32:37
 * @LastEditors: Jonath
 * @LastEditTime: 2020-08-12 13:05:23
 * @Description: rollup配置
 */
const serve = require("rollup-plugin-serve")
const babel = require("rollup-plugin-babel")
// rollup 适合做js库,打包速度快,打出来的包更小,打出来的包更干净,
// 因为Rollup基于ES2015模块，比Webpack和Browserify使用的CommonJS模块机制更高效。
// 这也让Rollup从模块中删除无用的代码，即tree-shaking变得更容易。
// 而webpack适合做项目,支持代码拆分和运行时态的动态导入
module.exports = {
  input: "src/index.js", // 打包文件入口
  output: {
    file: "dist/umd/vue.js", // 输出文件名
    name: "Vue", // 全局变量名
    format: "umd", // 输出文件模块格式  umd  cjs amd cmd esModules
    sourcemap: true
  },
  plugins: [
    babel({
      exclude: "node_modules/**" // babel 不处理node_modules下的js文件, 默认是已处理过的
    }),
    serve({
      //   open: true, // 是否打开浏览器
      port: 3000, // 启动服务的端口号
      contentBase: "",
      openPage: "/index.html" // 打开那个页面
    })
  ]
}
