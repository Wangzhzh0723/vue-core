// 开发过程很少对数组的索引进行操作,为了性能考虑不对数组进行监测
// 对可以改变原数组方法进行拦截，aop，切片编程，变异这些方法
// (pop、push、shift、unshift、sort、reverse、splice)

// 拿到原数组方法
const oldArrayProtoMethods = Array.prototype

// 继承数组方法
export const arrayMethods = Object.create(oldArrayProtoMethods)

const methods = ["pop", "push", "shift", "unshift", "sort", "reverse", "splice"]

methods.forEach(method => {
  arrayMethods[method] = function(...args) {
    // console.log("数组被调用了")
    const result = oldArrayProtoMethods[method].apply(this, arguments)
    let inserted
    switch (method) {
      // 新增 这两个方法都是追加,追加的内容可您能使对象类型,应该被再次进行拦截
      case "push":
      case "unshift":
        inserted = args
        break
      case "splice": // vue.$set原理  拿到新增的内容
        inserted = args.slice(2)
        break
      default:
        break
    }
    const ob = this.__ob__
    if (inserted) ob.observeArray(inserted) // 对新增的内容检测

    return result
  }
})
