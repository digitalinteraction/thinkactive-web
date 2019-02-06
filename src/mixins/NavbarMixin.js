/*
 * @vue/component
 * A mixin for a component to handle mobile nav toggling
 */
export default {
  data () {
    return { showMobileNav: false }
  },
  computed: {
    mobileClass () {
      return { 'is-active': this.showMobileNav }
    }
  },
  methods: {
    toggleMobileNav () {
      this.showMobileNav = !this.showMobileNav
    }
  }
}
