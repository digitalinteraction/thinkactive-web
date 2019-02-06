/*
 * @vue/component
 * A mixin for components to register events which are unregistered on destroy
 *
 * use this.listenFor(eventName, this.listener[, target]) to register
 */
export default {
  data: () => ({
    customEventListeners: []
  }),
  destroyed () {
    this.customEventListeners.forEach(({ name, method, target }) => {
      target.$off(name, method)
    })
  },
  methods: {
    listenFor (name, method, target = this) {
      this.customEventListeners.push({ name, method, target })
      target.$on(name, method)
    }
  }
}
