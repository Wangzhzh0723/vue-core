import { patch } from "./vdom/patch"
import Watcher from "./observer/watcher"

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vnode) {
    const vm = this
    vm.$el = patch(vm.$el, vnode)
  }
}

export function mountComponent(vm, el) {
  // 调用render方法去渲染  el属性
  // 先调用render方法创建虚拟节点, 在将虚拟节点渲染到页面上

  callHook(vm, "beforeMount")

  const updateComponent = () => {
    vm._update(vm._render())
  }
  // 初始化创建 watcher
  // 这个watcher是用于渲染的, 目前没有任何功能
  // 渲染watcher
  const watcher = new Watcher(
    vm,
    updateComponent,
    () => {
      callHook(vm, "beforeUpdate")
    },
    true
  )
  console.log(watcher, "mounted-")

  callHook(vm, "mounted")
}

export function callHook(vm, hook) {
  const hanlders = vm.$options[hook]
  if (hanlders) {
    hanlders.forEach(hanlder => hanlder.call(vm)) // 更改this
  }
}
