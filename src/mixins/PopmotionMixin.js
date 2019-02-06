/*
 * @vue/component
 * A mixin for components to register popmotion events which are unregistered
 * on destroy
 */
export default {
  data: () => ({
    popEvents: []
  }),
  destroyed () {
    this.popEvents.forEach(e => e.stop())
  },
  methods: {
    pushPopEvent (...events) {
      this.popEvents.push(...events)
    }
  }
}
