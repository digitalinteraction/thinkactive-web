<template lang="pug">
.not-found-page
  app-header
  .page-content
    hero.is-primary
      .container
        h1.title Not Found
        h2.subtitle Couldn't find that page
    section.section
      half-width
        h1.title Something went wrong
        p.is-size-5 We couldn't find the page you were looking for. If you typed out the url check it is correct. If not you can either go back or go home.
        hr
        .buttons.is-centered
          button.button.is-link(@click="$router.go(-1)")
            span.icon: fa(icon="chevron-left")
            span Go Back
          router-link.button.is-primary(:to="homeRoute")
            span.icon: fa(icon="home")
            span Go Home
  app-footer
</template>

<script>
import { ROUTES } from '@/constants'
import AppHeader from '@/components/structure/Header'
import AppFooter from '@/components/structure/Footer'

import Hero from '@/components/layout/Hero'
import HalfWidth from '@/components/layout/HalfWidth'

export default {
  components: { AppHeader, AppFooter, Hero, HalfWidth },
  computed: {
    homeRoute () {
      return { name: ROUTES.HOME }
    }
  }
}
</script>

<style lang="sass">
.not-found-page
  display: flex
  min-height: 100vh
  flex-direction: column
  .page-content
    flex: 1
</style>
