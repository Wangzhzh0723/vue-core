const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function generateProps(attrs) {
  let str = ""
  attrs.forEach(attr => {
    if (attr.name === "style") {
      const obj = {}
      if (attr.value) {
        attr.value.split(";").forEach(item => {
          const [key, value] = item.split(":")
          obj[key] = value
        })
      }
      attr.value = obj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  })
  return `{${str.slice(0, -1)}}`
}
function gen(node) {
  if (node.type === 1) {
    return generate(node) // 生产元素节点的字符串
  } else {
    let text = node.text // 获取文本
    if (!defaultTagRE.test(text)) {
      // 如果是普通文本,不带 {{}}
      return `_v(${JSON.stringify(text)})`
    }
    // 如果不是普通文本,携带 {{}}
    let tokens = [] // 存放每一段代码
    let lastIndex = (defaultTagRE.lastIndex = 0) // 如果正则是全局模式, 每次使用需要前置为0

    let match, index // 每次匹配到的结果

    while ((match = defaultTagRE.exec(text))) {
      index = match.index // 保存匹配到的索引
      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)))
      }
      tokens.push(`_s(${match[1].trim()})`)
      lastIndex = index + match[0].length
    }
    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)))
    }
    return `_v(${tokens.join("+")})`
  }
}
function generateChildren(el) {
  const children = el.children
  if (children) {
    // 将所有转化后的儿子用逗号拼接起来
    return children.map(child => gen(child)).join(",")
  }
}

export function generate(el) {
  const children = generateChildren(el)
  let code = `_c('${el.tag}', ${
    el.attrs.length ? generateProps(el.attrs) : undefined
  }${children ? `,${children}` : ""})`
  return code
}
