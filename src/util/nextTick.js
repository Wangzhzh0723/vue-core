const callbacks = []
let pendding = false
// 判断是否支持Promise => MutationObserver => setImmediate => setTimeout处理异步
// vue 使用promise.then,不做兼容处理了
function flushCallbacks() {
  callbacks.forEach(cb => cb())
  callbacks.length = 0
  pendding = false
}
const timeFunc = (function() {
  // 是否支持Promise, 支持使用Promise
  if (Promise) {
    return () => Promise.resolve().then(flushCallbacks) // Promise异步更新
  } else if (MutationObserver) {
    // 是否支持MutationObserver, 支持使用MutationObserver

    // MutationObserver 可以观测dom变化
    // 观测文本节点变化
    // 创建检测器
    const observer = new MutationObserver(flushCallbacks)
    // 创建文本节点
    const textNode = document.createTextNode(1)
    // 观测文本节点内容
    observer.observe(textNode, {
      characterData: true
    })
    return () => (textNode.textContent = 2)
  } else if (setImmediate) {
    // 是否支持setImmediate, 支持使用setImmediate

    return () => setImmediate(flushCallbacks)
  }
  // 以上都不支持,默认使用setTimeout
  return () => setTimeout(flushCallbacks)
})()

export default function nextTick(cb) {
  callbacks.push(cb)
  if (!pendding) {
    timeFunc()
    pendding = true
  }
}
