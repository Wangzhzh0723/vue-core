// <div>
//   姓名: {{ name }}
//   <br />
//   年龄: {{ age }}
// </div>

/**
 * {
 * tag: "div",
 * parent: null,
 * attrs: ["id"],
 * children: []
 * }
 *
 */

const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 匹配属性的
const startTagClose = /^\s*(\/?)>/ // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

// 数据结构  树、栈、链表、队列

export function parseHTML(html) {
  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      type: 1,
      children: [],
      attrs,
      parent: null
    }
  }
  let root,
    currentParent,
    stack = []
  function start(tagName, attrs) {
    // console.log(tagName, attrs, "start----")
    const element = createASTElement(tagName, attrs)
    if (!root) {
      root = element
    }
    currentParent = element //当前解析的标签 保存起来
    stack.push(element)
  }

  function end(tagName) {
    // console.log(tagName, "end----")
    // 取出tag栈中的最后一个
    const element = stack.pop()
    currentParent = stack[stack.length - 1]
    if (currentParent) {
      // 在闭合时可以知道这个标签的标签的父亲是谁
      currentParent.children.push(element)
      element.parent = currentParent
    }
  }

  function chars(text) {
    text = text.trim()
    if (text) {
      currentParent.children.push({
        type: 3,
        text,
        parent: currentParent
      })
    }
    // console.log(text, "---text--")
  }

  while (html) {
    //只要html不为空就一直解析
    let textEnd = html.indexOf("<")
    if (textEnd == 0) {
      // v-bind v-on等
      // 肯定是标签
      const startTagMatch = parseStartTag() // 开始标签皮匹配的结果
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1]) // 将结束标签传入
        continue
      }
    }
    let text
    if (textEnd > 0) {
      //是文本
      text = html.substring(0, textEnd)
    }
    if (text) {
      chars(text)
      advance(text.length)
    }
  }
  function advance(n) {
    html = html.substring(n)
  }
  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      // 删除开始标签
      advance(start[0].length)
      // 如果直接是闭合标签,书名没有属性
      let end, attr
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        })
        advance(attr[0].length)
      }
      if (end) {
        advance(end[0].length)
      }
      return match
    }
  }
  return root
}
