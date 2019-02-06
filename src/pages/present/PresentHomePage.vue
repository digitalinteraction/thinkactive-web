<template lang="pug">
.present-home
  hero.is-light.is-large.has-text-centered
    .container
      h1.title Coming Soon
      h2.subtitle The presenter view is a work in progress, check back soon
      .buttons.is-centered
        button.button.is-link(@click="$router.go(-1)")
          .icon
            fa(icon="chevron-left")
          span Go Back
</template>

<script>
import Hero from '@/components/layout/Hero'

export default {
  components: { Hero }
}
</script>

<style lang="css">
</style>
