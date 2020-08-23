import { isObject, isArray, defineProperty } from "../util/utils"
import { arrayMethods } from "./array"

class Observer {
  constructor(value) {
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
  Object.defineProperty(data, key, {
    get() {
      console.log("获取值", key, value)
      return value
    },
    set(newVal) {
      if (newVal === value) return
      console.log("设置值", key, newVal)
      value = newVal
      observe(newVal) //如果新值是对象的话再进行监测
    }
  })
  observe(value) // 如果值是对象的话再进行监测
}

export function observe(data) {
  if (!isObject(data) || data.__ob__) {
    return data
  }
  return new Observer(data)
}
