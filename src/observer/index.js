import { isObject, isArray, defineProperty } from "../util/utils"
import { arrayMethods } from "./array"
import Dep from "./dep"

class Observer {
  constructor(value) {
    this.dep = new Dep() // value = {} // value = []

    // 自定义__ob__属性, 不可枚举和删除
    defineProperty(value, "__ob__", this)

    if (isArray(value)) {
      // 变异可以改变数组的方法
      value.__proto__ = arrayMethods
      // 观测数组中对象的值
      this.observeArray(value)
      return
    }
    // 通过Object.defineProperty重新定义属性
    this.walk(value)
  }
  observeArray(value) {
    // 观测数组中对象的值
    value.forEach(item => observe(item))
  }
  walk(data) {
    const entries = Object.entries(data) // 获取对象[[key, value]]
    entries.forEach(([key, value]) => defineReactive(data, key, value))
  }
}
// 递归属性, 性能差
function defineReactive(data, key, value) {
  const childObserve = observe(value) // 如果值是对象的话再进行监测
  // 每个属性对应一个dep
  const dep = new Dep()

  // 当页面取值时 说明这个值用来渲染了, 将这个watcher和这个属性对应起来
  Object.defineProperty(data, key, {
    get() {
      // 让这个属性记住watcher
      if (Dep.target) {
        dep.depend()
        if (childObserve) {
          // 可能是数组也可能是对象
          // 默认给数组增加了一个dep属性, 当对数组这个对象取值的时候增加(存起来这个)渲染watcher
          childObserve.dep.depend()
        }
      }
      return value
    },
    set(newVal) {
      if (newVal === value) return
      value = newVal
      observe(newVal) // 如果新值是对象的话再进行监测
      dep.notify() // 通知更新  异步更新 防止多次操作
    }
  })
}

export function observe(data) {
  if (!isObject(data)) return
  if (data.__ob__) return data.__ob__
  return new Observer(data)
}
