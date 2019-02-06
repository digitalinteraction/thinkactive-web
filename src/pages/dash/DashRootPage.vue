<template lang="pug">
.dash-root-page(v-if="$store.state.user")
  router-view
</template>

<script>
import { ROUTES } from '@/constants'

export default {
  mounted () {
    if (this.$store.state.user) return
    this.$router.push({ name: ROUTES.LOGIN })
  }
}
</script>

<style lang="css">
</style>
