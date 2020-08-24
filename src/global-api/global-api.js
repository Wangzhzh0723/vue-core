import { mergeOptions } from "../util/utils"

export function initGlobalApi(Vue) {
  Vue.options = {} // diretive components
  Vue.mixin = function(mixin) {
    // 合并属性, 先考虑生命周期
    this.options = mergeOptions(this.options, mixin)
  }
}
