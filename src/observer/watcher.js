import { pushTarget, popTarget } from "./dep"

let id = 0
export default class Watcher {
  /**
   * @param {*} vm vue实例
   * @param {*} exprOrFn 更新函数
   * @param {*} cb 回调函数
   * @param {*} options 选项
   */
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm
    this.exprOrFn = exprOrFn
    this.cb = cb
    this.options = options
    this.id = ++id // watcher唯一标识
    this.deps = [] // watcher记录有多少dep依赖他
    this.depIds = new Set()
    if (typeof exprOrFn === "function") {
      this.getter = exprOrFn
    }
    this.get() // 默认会调用get方法
  }
  get() {
    pushTarget(this) // 当前watcher实例
    this.getter() // 调用 exprOrFn 渲染页面
    popTarget() // 移除watcher 防止data中不在页面中使用的属性被添加到dep中
  }
  update() {
    this.getter() // 重新渲染
  }
  addDep(dep) {
    const id = dep.id
    if (!this.depIds.has(id)) {
      this.depIds.add(id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }
}

// 在数据劫持的时候 定义defineProperty的时候 已经给每个属性添加了一个dep

// 1.事先把这个渲染watcher 放到Dep.target属性上
// 2.开始渲染页面时会取值,调用get方法, 需要让这个属性的dep存储当前的watcher
// 3.页面上所需要的属性都会将这个watcher存到自己的dep中
// 4.当数据更新, 就重新调用渲染函数逻辑

// 1.取数组的值, 会调用get方法 我们希望当前数组记住这个渲染watcher
// 2.给所有的对象类型都增加一个dep属性
// 3.当页面对数组取值时 就让数组的dep记录这个watcher
// 4.当调用劫持后的方法时, 使用dep通知更新
