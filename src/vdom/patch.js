import { isString } from "../util/utils"

export function patch(oldVnode, vnode) {
  let el
  // 默认初始化时 是直接用虚拟节点创建出来的真实节点替换老节点
  if (oldVnode.nodeType === 1) {
    // 真实节点
    // 将虚拟节点转化成真实的节点
    // 产生真实节点dom
    el = createElm(vnode)
    // 获取旧的父亲节点
    const parentElm = oldVnode.parentNode
    // 当前的真实元素插入到就元素之前
    parentElm.insertBefore(el, oldVnode.nextSibling)
    // 删除老的节点
    parentElm.removeChild(oldVnode)
    return el
  }
  // 在更新时 拿老的节点 和新的虚拟节点作对比 将不同的地方更新到真实的dom上

  // 同级比较
  // 1. 比较两个元素的标签  不一样直接替换掉
  if (oldVnode.tag !== vnode.tag) {
    // 替换旧节点
    const oldNode = oldVnode.el
    return oldNode.parentNode.replaceChild(createElm(vnode), oldNode)
  }
  // 2. 标签一样
  el = vnode.el = oldVnode.el // 复用老节点
  // 2.1 tag都是undefined , 文本对比
  if (!oldVnode.tag) {
    if (oldVnode.text !== vnode.text) {
      return (oldVnode.el.textContent = vnode.text)
    }
  }
  // 2.2 对比标签的属性 和 儿子节点

  // 更新属性 用心的虚拟节点的属性和老的比较, 去更新节点
  updateProperties(vnode, oldVnode.data)

  // 比较孩子
  // 儿子比较分为以下几种情况
  // 1.旧的有儿子 新的没儿子
  // 2.老的没儿子 新的有儿子
  // 3.老的有儿子 新的也有儿子 ====>> 真正的diff算法
  const oldChildren = oldVnode.children || []
  const newChildren = vnode.children || []
  if (oldChildren.length && newChildren.length) {
    // 老的有儿子 新的也有儿子  diff算法
    // 浏览器有性能优化  不用在搞文档碎片 Fragment
    updateChildren(oldChildren, newChildren, el)
  } else if (oldChildren.length) {
    // 旧的有儿子 新的没儿子
    el.innerHTML = ""
  } else if (newChildren.length) {
    // 老的没儿子 新的有儿子
    newChildren.forEach(child => el.appendChild(createElm(child)))
  }
}

function isSameVnode(oldVnode, newVnode) {
  return oldVnode.tag === newVnode.tag && oldVnode.key === newVnode.key
}

/**
 * 儿子间的比较  diff核心算法
 * @param {*} oldChildren 旧
 * @param {*} newChildren 新
 */
function updateChildren(oldChildren, newChildren, parentEl) {
  // vue 中的diff算法做了很多性能优化
  // Dom中的操作有很多常见的逻辑  把节点插入到当前儿子的头部 尾部 儿子正序倒序
  // vue2中采用的是双指针的方式
  // 在尾部添加
  // 做一个循环 同时循环老的和新的, 哪个先停止,循环就结束,将多余的删除或添加进去

  let oldStartIndex = 0 // 旧的索引
  let oldStartVnode = oldChildren[0] // 就的索引指向节点
  let oldEndIndex = oldChildren.length - 1
  let oldEndVnode = oldChildren[oldEndIndex]

  let newStartIndex = 0 // 新的的索引
  let newStartVnode = newChildren[0] // 新的索引指向节点
  let newEndIndex = newChildren.length - 1
  let newEndVnode = newChildren[newEndIndex]
  function makeIndexKey(children = []) {
    // {A: 0, B: 1 ...}
    return children.reduce((pre, cur, index) => {
      if (cur.key) {
        pre[cur.key] = index
      }
    }, {})
  }
  const map = makeIndexKey(oldChildren)
  // 比较谁先循环停止
  // oldStartVnode  newStartVnode // 如果两个是同一个元素, 比较儿子
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (!oldStartVnode) {
      // 如果指针为undefined 跳过本次处理
      oldStartVnode = oldChildren[++oldStartIndex]
    } else if (!oldEndVnode) {
      // 如果指针为undefined 跳过本次处理
      oldEndVnode = oldChildren[--oldEndIndex]
    } else if (isSameVnode(oldStartVnode, newStartVnode)) {
      // 更新属性和再去递归更新子节点
      patch(oldStartVnode, newStartVnode)
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      patch(oldEndVnode, newEndVnode)
      oldEndVnode = oldChildren[--oldEndIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      // 反转节点  头部移动到尾部  尾部移动到头部
      // 老的头部和新的尾部比较
      patch(oldStartVnode, newEndVnode)
      parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
      oldStartVnode = oldChildren[++oldStartIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      // 反转节点  头部移动到尾部  尾部移动到头部
      // 老的尾部和新的头部比较
      patch(oldEndVnode, newStartVnode)
      parent.insertBefore(oldEndVnode.el, oldStartVnode.el)
      oldEndVnode = oldChildren[--oldEndIndex]
      newStartVnode = newChildren[++newStartIndex]
      // 为什么要有key ? 循环的时候为什么不能使用索引作为key?
      // 为了复用 移动dom节点
      // 更新DOM的时候会出现性能问题
      // 会发生一些状态bug
    } else {
      // 儿子之间完全没关系  ... 暴力对比
      const moveIndex = map[newStartVnode.key] // 拿到开头的虚拟节点的key, 在老的map中查找

      if (moveVnode !== undefined) {
        // 找到老的虚拟节点
        const moveVnode = oldChildren[moveIndex] // 拿到老的虚拟节点 移动
        oldChildren[moveIndex] = undefined
        parentEl.insertBefore(moveVnode.el, oldStartVnode.el)
        patch(moveVnode, newStartVnode) // 比较属性和儿子
      } else {
        // 不存在
        parentEl.insertBefore(createElm(newStartVnode), oldStartVnode.el)
      }
      newStartVnode = newChildren[++newStartIndex] // 用新的不停的去老的里面去找
    }
  }
  // 如果新的有多余, 将多余的节点插入  可能是向前添加 还有可能是向后添加
  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      // parentEl.appendChild(createElm(newChildren[i]))
      // 向后插入 ele == null
      // 向前插入 ele 就是当前向谁前面插入
      const ele = newChildren[i + 1] ? newChildren[i + 1].el : null
      parentEl.insertBefore(createElm(newChildren[i]), ele)
    }
  }
  // 如果老的有多余需要移除掉
  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      const child = oldChildren[i]
      if (child !== undefined) {
        parentEl.removeChild(child.el)
      }
    }
  }
}

function createElm(vnode) {
  const { tag, children, key, data, text } = vnode

  if (isString(tag)) {
    vnode.el = document.createElement(tag)
    // 更新属性
    updateProperties(vnode)
    children.forEach(child => vnode.el.appendChild(createElm(child)))
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}

function updateProperties(vnode, oldProps = {}) {
  const el = vnode.el
  const newProps = vnode.data || {}

  for (const key in oldProps) {
    if (!newProps[key]) {
      el.removeAttribute(key) // 移除真实dom属性
    }
  }

  // 样式处理
  const oldStyle = oldProps.style || {}
  const newStyle = newProps.style || {}

  // 老的样式中有 新的没有 删除老的样式
  for (const key in oldStyle) {
    if (!newStyle[key]) {
      el.style[key] = ""
    }
  }

  for (const key in newProps) {
    const value = newProps[key]

    if (key === "style") {
      // 如果是style
      const style = value || {}
      const styleList = {}
      for (const styleName in style) {
        styleList[styleName] = style[styleName]
      }
      Object.assign(el.style, styleList)
    } else if (key === "class") {
      // 如果是class
      el.className = value
    } else {
      el.setAttribute(key, value)
    }
  }
}
