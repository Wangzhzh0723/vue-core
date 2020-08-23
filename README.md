### vue 核心

#### 基于 rollup 进行打包

- 1. `git clone https://github.com/Wangzhzh0723/vue-core`
- 2. `cd vue-core`
- 3. `yarn`
- 4. `yarn dev`

#### 渲染流程 (ast 解析 templete ==> render 函数)

- 默认会先找 render 方法
- 找不到 render 方法,会查找 templete
- templete 不存在,会找当前 el 指定的元素中的内容来进行渲染
