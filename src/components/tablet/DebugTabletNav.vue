<template lang="pug">
header
  nav.navbar.is-light
    .container
      .navbar-brand
        .navbar-burger(@click="toggleMobileNav", :class="mobileClass")
          span(aria-hidden="true")
          span(aria-hidden="true")
          span(aria-hidden="true")
      .navbar-menu(:class="mobileClass")
        .navbar-start
          router-link.navbar-item(:to="backRoute", :class="isActive(backRoute)")
            .icon
              fa(icon="chevron-left")
            span Back
          a.navbar-item.has-dropdown(
            :class="{'is-active': showDebug}",
            @click="showDebug = !showDebug",
            @mouseenter="showDebug = true"
            @mouseleave="showDebug = false"
          )
            a.navbar-link DEBUG
            .navbar-dropdown.is-paddingless
              pre
                | 1: Device++
                | 2: Device--
                | 3: Scan Device
                | 4: Scan Food
                | 5: Force Timeout
        .navbar-end
          router-link.navbar-item(:to="defaultRoute", :class="isActive(defaultRoute)")
            .icon
              fa(icon="tablet-alt")
            span Tablet Home
          router-link.navbar-item(:to="syncingRoute", :class="isActive(syncingRoute)")
            .icon
              fa(icon="sync")
            span Syncing
          router-link.navbar-item(:to="detailRoute", :class="isActive(detailRoute)")
            .icon
              fa(icon="child")
            span Detail
          router-link.navbar-item(:to="foodRoute", :class="isActive(foodRoute)")
            .icon
              fa(icon="lemon")
            span Food
</template>

<script>
import { NavbarMixin } from '@/mixins'
import { ROUTES } from '@/constants'

export default {
  mixins: [ NavbarMixin ],
  props: {
    backRoute: { type: Object, required: true }
  },
  computed: {
    defaultRoute () {
      return {
        name: ROUTES.TABLET_HOME,
        params: { ...this.$route.params }
      }
    },
    syncingRoute () {
      return {
        name: ROUTES.DEVICE_SYNC,
        params: { ...this.$route.params, deployment_user_id: 1 }
      }
    },
    detailRoute () {
      return {
        name: ROUTES.DEVICE_DETAIL,
        params: { ...this.$route.params, deployment_user_id: 1 }
      }
    },
    foodRoute () {
      return {
        name: ROUTES.FOOD_DETAIL,
        params: { ...this.$route.params, food_id: 1 }
      }
    }
  },
  methods: {
    isActive (route) {
      return { 'is-active': this.$route.name === route.name }
    }
  }
}
</script>

<style lang="css">
</style>
