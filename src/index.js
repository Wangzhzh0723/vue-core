import { initMixin } from "./init"
import { lifecycleMixin } from "./lifecycle"
import { renderMixin } from "./vdom/index"

// 入口文件
// es6的类的写法  是一个整体
export default function Vue(options) {
  this._init(options) // 初始化方法
}

// 写成一个个的插件对原型进行扩展
initMixin(Vue)
lifecycleMixin(Vue) // 混合生命周期
renderMixin(Vue)
