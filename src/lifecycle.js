import { patch } from "./vdom/patch"

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vnode) {
    const vm = this
    vm.$el = patch(vm.$el, vnode)
  }
}

export function mountComponent(vm, el) {
  // 调用render方法去渲染  el属性

  callHook(vm, "beforeMount")

  // 先调用render方法创建虚拟节点, 在将虚拟节点渲染到页面上
  vm._update(vm._render())

  callHook(vm, "mounted")
}

export function callHook(vm, hook) {
  const hanlders = vm.$options[hook]
  if (hanlders) {
    hanlders.forEach(hanlder => hanlder.call(vm)) // 更改this
  }
}
