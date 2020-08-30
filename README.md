### vue 核心

#### 基于 rollup 进行打包

- 1. `git clone https://github.com/Wangzhzh0723/vue-core`
- 2. `cd vue-core`
- 3. `yarn`
- 4. `yarn dev`

#### 渲染流程 (ast 解析 template ==> render 函数)

- 默认会先找 render 方法
- 找不到 render 方法,会查找 template
- template 不存在,会找当前 el 指定的元素中的内容来进行渲染

#### 属性依赖更新

- 1. 初始化创建 watcher, 事先把这个渲染 watcher 放到 Dep.target 属性上
- 2. 开始渲染页面时会取值,调用 get 方法, 需要让这个属性的 dep 存储当前的 watcher
- 3. 页面上所需要的属性都会将这个 watcher 存到自己的 dep 中
- 4. 当数据更新, 就重新调用渲染函数逻辑

##### 对于数组属性依赖更新

- 1. 取数组的值, 会调用 get 方法 我们希望当前数组记住这个渲染 watcher
- 2. 给所有的对象类型都增加一个 dep 属性
- 3. 当页面对数组取值时 就让数组的 dep 记录这个 watcher
- 4. 当调用劫持后的方法时, 使用 dep 通知更新
