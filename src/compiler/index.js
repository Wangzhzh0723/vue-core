import { generate } from "./generate"
import { parseHTML } from "./parse"

export function compileToFunction(template) {
  // html模板 ==> render函数
  // 1. 需要将html转成"ast"语法树, 可以用ast树来描述语言本身, 虚拟dom是用来描述节点的

  const ast = parseHTML(template)
  //   console.log(ast)
  // 2. 优化静态节点
  // 3. 通过这棵树重新生成代码
  const code = generate(ast)
  //   console.log(code)
  // 4. 将字符串转成render函数
  // 限制取值范围, 通过with来进行取值  然后调用render函数就可以通过改变this, 让这个函数内部取到结果了
  const render = new Function(`with(this){return ${code}}`)
  return render
}
