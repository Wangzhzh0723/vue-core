import { isObject } from "../util/utils"

export function renderMixin(Vue) {
  Vue.prototype._render = function() {
    const vm = this
    const render = vm.$options.render
    let vnode = render.call(vm)
    console.log(vnode)
    return vnode
  }
  // 创建元素
  Vue.prototype._c = function() {
    return createElement(...arguments)
  }
  // stringify
  Vue.prototype._s = function(val) {
    return val == null ? "" : isObject(val) ? JSON.stringify(val) : val
  }
  // 创建文本元素
  Vue.prototype._v = function(text) {
    return createTextVnode(text)
  }
}
// 创建元素
function createElement(tag, data = {}, ...children) {
  return vnode(tag, data, data.key, children)
}
// 创建文本元素
function createTextVnode(text) {
  return vnode(undefined, undefined, undefined, undefined, text)
}

// 产生虚拟dom
function vnode(tag, data, key, children, text) {
  return {
    tag,
    data,
    key,
    children,
    text
  }
}
