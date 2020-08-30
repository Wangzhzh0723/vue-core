import { mergeOptions } from "../util/utils"

export default function initExtend(Vue) {
  let cid = 0
  // 核心就是创建一个子类继承父类
  Vue.extend = function(extendOptions) {
    // 如果对象相同 应该复用构造函数(cache) 暂不实现
    const Super = this
    const Sub = function VueConponent(options) {
      this._init(options)
    }
    Sub.cid = ++cid
    // 寄生组合继承
    Sub.prototype = Object.create(Super.prototype, {
      constructor: { value: Sub }
    })
    // 处理其他属性 minins ...
    // 合并options
    Sub.options = mergeOptions(Super.options, extendOptions)
    Sub.components = Super.components
    // ....
    return Sub
  }
}

// 组件的渲染流程
// 1. 调用Vue.component
// 2. 内部调用Vue.extend 产生一个子类继承于父类
// 3. 等会创建子类的时候会调用父类的_init方法
// 4. 然后$mount即可
// 5. 组件的初始化就是 new 这个组件的构造方法 并且调用调用 $mount 方法
//
// 6. 组件创建真实dom时 (先渲染的是父组件) 遇到是组件的虚拟节点时, 去掉用init方法, 让组件初始化并挂载,
//    组件的$mount无参数会把渲染后的dom放到 vm.$el 上 ==>> vnode.componentInstance中, 这样渲染的时候,获取这个对象的$el属性来渲染
