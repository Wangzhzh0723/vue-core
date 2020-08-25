import { observe } from "./observer/index"
import { proxy } from "./util/proxy"
import nextTick from "./util/nextTick"
import { isArray, isObject, isString } from "./util/utils"
import Watcher from "./observer/watcher"

export function initState(vm) {
  // vm.$options
  const opts = vm.$options
  if (opts.props) {
    initProps(vm)
  }
  if (opts.methods) {
    initMethods(vm)
  }
  if (opts.data) {
    initData(vm)
  }
  if (opts.computed) {
    initComputed(vm)
  }
  if (opts.watch) {
    initWatch(vm)
  }
}

function initProps(vm) {}
function initMethods(vm) {}
function initData(vm) {
  // 初始化数据操作
  let data = vm.$options.data
  vm._data = data = typeof data === "function" ? data.call(vm) : data

  // 将属性代理到vm._data上
  for (const key in data) {
    proxy(vm, "_data", key)
  }

  // 基于Object.definProperty进行数据劫持
  // 数组单独处理
  observe(data)
}
function initComputed(vm) {}
function initWatch(vm) {
  const watch = vm.$options.watch || {}
  for (const key in watch) {
    let handler = watch[key] // 可能是数组 对象 函数 字符串
    if (isArray(handler)) {
      handler.forEach(h => createWatcher(vm, key, h))
    } else {
      // 字符串 对象 函数
      createWatcher(vm, key, handler)
    }
  }
}

function createWatcher(vm, exprOrFn, handler, options) {
  // options 是用户传的参数
  if (isObject(handler)) {
    options = handler
    handler = handler.handler // 是一个函数
  }

  if (isString(handler)) {
    handler = vm[handler] // 将实例的方法作为handler
  }

  return vm.$watch(exprOrFn, handler, options)
}

export function stateMixin(Vue) {
  Vue.prototype.$nextTick = function(cb) {
    nextTick(cb)
  }

  Vue.prototype.$watch = function(exprOrFn, cb, options = {}) {
    // 数据变化后应该往这个watcher重新执行
    const watcher = new Watcher(this, exprOrFn, cb, { ...options, user: true })
    if (options.immediate) {
      cb(watcher.getter(), undefined) // 如果是immediate 立即执行
    }
  }
}
