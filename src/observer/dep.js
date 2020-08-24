let id = 0
export default class Dep {
  constructor() {
    this.id = ++id // 唯一标识
    this.subs = []
  }
  depend() {
    // watcher 可以存放 dep
    // 实现双向记录, 并去重
    // 让dep记录watcher , watcher记录dep
    Dep.target.addDep(this)

    // this.subs.push(Dep.target)
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
  notify() {
    this.subs.forEach(watcher => watcher.update())
  }
}

Dep.target = null

export function pushTarget(watcher) {
  Dep.target = watcher // 保留watcher
}

export function popTarget() {
  Dep.target = null // 移除watcher
}

// 多对多的关系  一个属性有一个dep 是用来收集watcher的
// dep  可以存放多个watcher
// 一个watcher可以对应多个dep
