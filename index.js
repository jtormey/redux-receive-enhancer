
module.exports = (createStore) => (...args) => {
  const store = createStore(...args)
  const dispatch = store.dispatch
  const receivers = []

  store.dispatch = (action) => {
    dispatch(action)
    receivers.forEach(r => r[action.type] && r[action.type](action))
  }

  store.receive = (types) => new Promise((resolve, reject) => {
    let timer
    let linked = {}

    let remove = () => {
      clearTimeout(timer)
      let index = receivers.indexOf(linked)
      if (index > -1) receivers.splice(index, 1)
    }

    Object.keys(types).forEach(t => {
      linked[t] = (...args) => {
        remove()
        resolve(types[t](...args))
      }
    })

    if (types.timeout && types.timeout[0] > 0) {
      let [time, f] = types.timeout
      timer = setTimeout(() => {
        remove()
        typeof f === 'function' ? resolve(f()) : reject(new Error('TIMEOUT'))
      }, time)
    }

    receivers.push(linked)
  })

  return store
}
