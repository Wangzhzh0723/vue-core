import { observe } from "./observer/index"
import { proxy } from "./util/proxy"

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
function initWatch(vm) {}
