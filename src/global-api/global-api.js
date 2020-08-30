import { mergeOptions } from "../util/utils"
import initExtend from "./extend"

export function initGlobalApi(Vue) {
  Vue.options = {} // diretive components
  Vue.mixin = function(mixin) {
    // 合并属性, 先考虑生命周期
    this.options = mergeOptions(this.options, mixin)
  }
  Vue.options._base = Vue // _base 最终的Vue的构造函数我保留在options对象中
  Vue.options.components = {}
  initExtend(Vue)
  Vue.component = function(id, definition) {
    // Vue.extend()
    definition.name = definition.name || id // 默认会以name属性为准  不存在使用id
    // 根据当前组件对象  生成了一个子类的构造函数
    definition = this.options._base.extend(definition)

    //Vue.component 注册组件  等价于  Vue.options.components[id] = definition
    Vue.options.components[id] = definition
  }
}
