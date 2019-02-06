<template lang="pug">
header
  nav.navbar
    .container
      .navbar-brand
        router-link.navbar-item(:to="{name: 'Home'}")
          strong ThinkActive.io
          //- .icon
          //-   img(src="/static/brand.png")
        .navbar-burger(@click="toggleMobileNav", :class="mobileClass")
          span
          span
          span
      .navbar-menu(:class="mobileClass")
        .navbar-end
          router-link.navbar-item(:to="authLink")
            .icon
              fa(:icon="authIcon")
            span {{authText}}
</template>

<script>
import { ROUTES } from '@/constants'
import { NavbarMixin } from '@/mixins'

export default {
  mixins: [ NavbarMixin ],
  computed: {
    authLink () {
      return { name: this.$store.state.user ? ROUTES.DASH_HOME : ROUTES.LOGIN }
    },
    authText () {
      return this.$store.state.user ? 'Dashboard' : 'Login'
    },
    authIcon () {
      return this.$store.state.user ? 'wrench' : 'user-circle'
    }
  }
}
</script>

<style lang="css">
</style>
