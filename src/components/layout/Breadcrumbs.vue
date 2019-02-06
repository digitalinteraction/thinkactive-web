<template lang="pug">
nav.breadcrumb(v-if="$route.matched.length > 1", aria-label="breadcrumbs")
  ul
    li(v-for="route in $route.matched", v-if="route.meta.crumb || route.meta.crumbIcon", :class="routeClasses(route)")
      router-link(:to="routeLink(route)")
        .icon.is-small(v-if="route.meta.crumbIcon")
          fa(:icon="route.meta.crumbIcon", size="sm")
        span(v-if="route.meta.crumb") {{route.meta.crumb}}
</template>

<script>
export default {
  computed: {
    lastRoute () {
      let route = null
      this.$route.matched.forEach(r => {
        if (r.meta.crumb) route = r
      })
      return route
    }
  },
  methods: {
    routeClasses (route) {
      return {
        'is-active': route === this.lastRoute
      }
    },
    routeLink (route) {
      let name = route.meta.holderFor || route.name
      return name ? { name } : route.path
    }
  }
}
</script>

<style lang="css">
</style>
