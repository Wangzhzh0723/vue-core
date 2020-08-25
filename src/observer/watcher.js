import { pushTarget, popTarget } from "./dep"
import nextTick from "../util/nextTick"
import { isBoolean } from "../util/utils"

let id = 0
export default class Watcher {
  /**
   * @param {*} vm vue实例
   * @param {*} exprOrFn 更新函数
   * @param {*} cb 回调函数
   * @param {*} options 选项
   */
  constructor(vm, exprOrFn, cb, options = {}) {
    this.vm = vm
    this.exprOrFn = exprOrFn
    this.cb = cb
    this.options = options
    this.user = !!options.user // 用户watcher
    this.isWatcher = isBoolean(options) // 是渲染watcher

    this.id = ++id // watcher唯一标识
    this.deps = [] // watcher记录有多少dep依赖他
    this.depIds = new Set()
    if (typeof exprOrFn === "function") {
      this.getter = exprOrFn
    } else {
      this.getter = function() {
        // exprOrFn可能是一个字符串
        // 当去实例上取值的时候 才会触发依赖收集
        const path = exprOrFn.split(".") // ["a", "b"]
        let obj = vm,
          curPath
        while ((curPath = path.shift())) {
          obj = obj[curPath]
        }
        return obj
      }
    }
    // 默认会调用get方法
    // 进行取值, 将结果保留下来
    this.value = this.get()
  }
  get() {
    pushTarget(this) // 当前watcher实例
    const result = this.getter() // 调用 exprOrFn 渲染页面
    popTarget() // 移除watcher 防止data中不在页面中使用的属性被添加到dep中
    return result
  }
  update() {
    // 队列watcher
    queueWatcher(this)
    // this.getter() // 重新渲染
  }
  run() {
    const newVal = this.getter() // 重新渲染
    const oldVal = this.value
    if (this.user) {
      this.cb.call(this.vm, newVal, oldVal)
    }
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
// 将需要批量更新的watcher存到一个队列中, 稍后让watcher执行
// 利用evenloop事件环
const queue = []
const has = new Set()
let pendding = false

function flushSchedulerQueue() {
  queue.forEach(watcher => {
    watcher.run()
    if (watcher.isWatcher) {
      watcher.cb()
    }
  })
  queue.length = 0 // 清空队列
  has.clear() // 清空标识
  pendding = false
}
function queueWatcher(watcher) {
  const id = watcher.id
  if (!has.has(id)) {
    // 去重watcher
    queue.push(watcher)
    has.add(id)
    if (!pendding) {
      // 如果队列还在pendding, 就不在开启定时器
      nextTick(flushSchedulerQueue)
      pendding = true
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
