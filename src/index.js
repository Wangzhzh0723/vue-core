import { initMixin } from "./init"
import { lifecycleMixin } from "./lifecycle"
import { renderMixin } from "./vdom/index"
import { initGlobalApi } from "./global-api/global-api"
import { stateMixin } from "./state"

// 入口文件
// es6的类的写法  是一个整体
export default function Vue(options) {
  this._init(options) // 初始化方法
}

// 原型方法
// 写成一个个的插件对原型进行扩展
initMixin(Vue)
lifecycleMixin(Vue) // 混合生命周期
renderMixin(Vue)
stateMixin(Vue)

// 静态方法  conponent directive extend mixin
initGlobalApi(Vue)
