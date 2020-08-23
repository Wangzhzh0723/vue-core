export function proxy(vm, data, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[data][key]
    },
    set(newVal) {
      vm[data][key] = newVal
    }
  })
}
