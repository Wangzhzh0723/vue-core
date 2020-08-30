const prototypeToString = Object.prototype.toString

const isType = type => obj => prototypeToString.call(obj) === `[object ${type}]`

export const isArray = isType("Array")
export const isString = isType("String")
export const isNumber = isType("Number")
export const isBoolean = isType("Boolean")

// typeof是判断计算机底层数据类型的值(二进制)
// object 对象存储在计算机中都是以000开始的二进制存储的
// 而null全是0, 所以检测出来的结果是object,
// 需要判断 目标对象不为null
export const isObject = obj => typeof obj === "object" && obj !== null
export const isFunction = obj => typeof obj === "function"

export const defineProperty = (target, key, value) => {
  Object.defineProperty(target, key, {
    enumerable: false,
    configurable: false,
    value: value
  })
}

export const LIFECYCLE_HOOKS = [
  "beforeCreate",
  "created",
  "beforeMount",
  "mounted",
  "beforeUpdate",
  "updated",
  "beforeDestroy",
  "destroyed"
]

const strats = {}
strats.components = function(parentVal, childVal = {}) {
  // res.__proto__ = parentVal
  const res = Object.create(parentVal)
  for (const key in childVal) {
    res[key] = childVal[key]
  }
  return res
}
// strats.data = function(parentVal, childVal) {
//   // 先不处理
//   return childVal
// }
// strats.computed = function() {}
// strats.watch = function() {}
// 生命周期的合并
function mergeHook(parentVal, childVal) {
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal) // 拼接父子
    } else {
      return [childVal] // 返回儿子,转化为数组
    }
  } else {
    return parentVal // 不合并 采用父亲的
  }
}

LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})

export function mergeOptions(parent, child) {
  // 遍历父亲,可能父亲有, 儿子没有
  const options = {}

  for (const key in parent) {
    // 父亲和儿子都有
    mergeField(key)
  }

  for (const key in child) {
    // 儿子有父亲没有
    // 将儿子多的赋予到父亲上

    if (!parent.hasOwnProperty(key)) {
      mergeField(key)
    }
  }

  function mergeField(key) {
    // 合并字段
    // 根据 key 不同的策略进行合并
    if (strats[key]) {
      options[key] = strats[key](parent[key], child[key])
    } else {
      // todo默认合并
      options[key] = child[key] ? child[key] : parent[key]
    }
  }
  return options
}

function makeMap(str) {
  const mapping = {}
  const list = str.split(",")
  for (let i = 0; i < list.length; i++) {
    mapping[list[i]] = true
  }
  // 判断标签名是否是真实标签
  return key => !!mapping[key]
}

export const isReservedTag = makeMap(
  "a,div,image,img,text,p,span,li,ul,input,button,textarea,h1,h2,h3,h4,h5,h6"
)
