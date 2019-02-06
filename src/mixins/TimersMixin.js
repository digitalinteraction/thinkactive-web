
/** Return the passed value or if a function return what it returns  */
function callFuncOrValue (funcOrValue, thisArg) {
  return (typeof funcOrValue === 'function'
    ? funcOrValue.apply(thisArg)
    : funcOrValue) || {}
}

/** Validate if a timer (timeout/interval) can be registered */
function validateTimer (duration, method) {
  if (typeof method !== 'function') {
    throw new Error(`<TimersMixin> Invalid ${name} method`)
  }
  if (typeof duration !== 'number') {
    throw new Error(`<TimersMixin> Invalid ${name} duration`)
  }
}

/* Example usage:

const comp = {
  intervals: {
    pageTick: 4000
  },
  timeouts: {
    fadeOut: 30000
  },
  methods: {
    pageTick () {
      // Called every 4 seconds
    },
    fadeOut () {
      // Called once after 30 seconds
    }
  }
}

*/

/*
 * @vue/component
 * A mixin for components to register timeouts/intervals on create and
 * unregister them when the it the component is destroyed
 */
export default {
  data: () => ({
    intervalIds: [],
    timeoutIds: []
  }),
  mounted () {
    // Register intervals
    let intervals = callFuncOrValue(this.$options.intervals, this)
    Object.entries(intervals).forEach(([methodName, interval]) => {
      this.addInterval(interval, this[methodName])
    })

    // Register timeouts
    let timeouts = callFuncOrValue(this.$options.timeouts, this)
    Object.entries(timeouts).forEach(([methodName, duration]) => {
      this.addTimeout(duration, this[methodName])
    })
  },
  destroyed () {
    this.intervalIds.forEach(id => clearInterval(id))
    this.intervalIds = []

    this.timeoutIds.forEach(id => clearTimeout(id))
    this.timeoutIds = []
  },
  methods: {
    addInterval (duration, method) {
      validateTimer(duration, method)
      let id = setInterval(method, duration)
      this.intervalIds.push(id)
      return id
    },
    addTimeout (duration, method) {
      validateTimer(duration, method)
      let id = setTimeout(method, duration)
      this.timeoutIds.push(id)
      return id
    },
    removeTimeout (id) {
      clearTimeout(id)
    }
  }
}
