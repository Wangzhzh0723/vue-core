import { isObject, isReservedTag } from "../util/utils"

export function renderMixin(Vue) {
  Vue.prototype._render = function() {
    const vm = this
    const render = vm.$options.render
    let vnode = render.call(vm)
    // console.log(vnode)
    return vnode
  }
  // 创建元素
  Vue.prototype._c = function() {
    return createElement(this, ...arguments)
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
function createElement(vm, tag, data = {}, ...children) {
  // 如果是组件  产生虚拟节点时需要把组件的构造函数传入
  // new Ctor().$mount()
  // 根据tag名判断是否是一个组件
  if (isReservedTag(tag)) {
    return vnode(tag, data, data.key, children)
  }
  const Ctor = vm.$options.components[tag]
  // 创建组件的虚拟节点
  // new Ctor()
  return createComponent(vm, tag, data, data.key, children, Ctor)
}

// 创建组件虚拟节点
function createComponent(vm, tag, data, key, children, Ctor) {
  const baseCtor = vm.$options._base
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor)
  }
  // 给组件增加生命周期
  data.hook = {
    // 稍后初始化组件时  会调用此init方法
    init() {}
  }
  return vnode(
    `vue-component-${Ctor.cid}-${tag}`,
    data,
    key,
    undefined,
    undefined,
    {
      Ctor,
      children
    }
  )
}

// 创建文本元素
function createTextVnode(text) {
  return vnode(undefined, undefined, undefined, undefined, text)
}

// 产生虚拟dom
function vnode(tag, data, key, children, text, conponentOptions) {
  return {
    tag,
    data,
    key,
    children,
    text,
    conponentOptions // 组件的虚拟节点多了一个conponentOptions属性, 来保存组件的构造函数和插槽
  }
}
