const prototypeToString = Object.prototype.toString

const isType = type => obj => prototypeToString.call(obj) === `[object ${type}]`

export const isArray = isType("Array")
export const isString = isType("String")
export const isNumber = isType("Number")

// typeof是判断计算机底层数据类型的值(二进制)
// object 对象存储在计算机中都是以000开始的二进制存储的
// 而null全是0, 所以检测出来的结果是object,
// 需要判断 目标对象不为null
export const isObject = obj => typeof obj === "object" && obj !== null

export const defineProperty = (target, key, value) => {
  Object.defineProperty(target, key, {
    enumerable: false,
    configurable: false,
    value: value
  })
}
