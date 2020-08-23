import { initState } from "./state"
import { compileToFunction } from "./compiler/index"
import { mountComponent } from "./lifecycle"

export function initMixin(Vue) {
  Vue.prototype._init = function(options) {
    const vm = this
    vm.$options = options

    // vue里面核心特性 响应式数据原理
    // vue 是一个什么样的框架 参考MVVM
    // 不完全是MVVM(数据变化是视图更新, 视图变化数据会被影响, MVVM不会直接跳过数据去更新视图, 而vue可以通过$ref直接操作dom)

    // 初始化状态
    // 将数据进行劫持, 当数据变化的时候更新视图
    // vue组件中处理状态(data, props, watch, computed)
    initState(vm)

    if (options.el) {
      this.$mount(options.el)
    }
  }
  Vue.prototype.$mount = function(el) {
    const vm = this
    const options = this.$options
    vm.$el = el = document.querySelector(el)
    if (!options.render) {
      // 没传render, 将templete转成render
      let templete = options.templete
      if (!templete && el) {
        templete = el.outerHTML
      }
      // 将templete转成render
      const render = compileToFunction(templete)
      options.render = render
    }
    mountComponent(vm, el)
  }
}
