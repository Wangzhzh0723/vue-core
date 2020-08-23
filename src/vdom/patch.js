import { isString } from "../util/utils"

export function patch(oldVnode, vnode) {
  // 将虚拟节点转化成真实的节点

  // 产生真实节点dom
  const el = createElm(vnode)
  // 获取旧的父亲节点
  const parentElm = oldVnode.parentNode
  // 当前的真实元素插入到就元素之前
  parentElm.insertBefore(el, oldVnode.nextSibling)
  // 删除老的节点
  parentElm.removeChild(oldVnode)
  return el
}

function createElm(vnode) {
  const { tag, children, key, data, text } = vnode

  if (isString(tag)) {
    vnode.el = document.createElement(tag)
    children.forEach(child => {
      vnode.el.appendChild(createElm(child))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}
