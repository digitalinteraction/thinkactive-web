<template lang="pug">
.web-app
  app-header
  splash-message(:should-overlay="true")
  .app-content
    section.crumbs
      .container
        breadcrumbs
    router-view
    section.section
  app-footer
</template>

<script>
import AppHeader from '@/components/structure/Header'
import AppFooter from '@/components/structure/Footer'
import SplashMessage from '@/components/structure/SplashMessage'
import Breadcrumbs from '@/components/layout/Breadcrumbs'

export default {
  components: {
    AppHeader,
    AppFooter,
    SplashMessage,
    Breadcrumbs
  }
}
</script>

<style lang="sass">

.web-app
  display: flex
  min-height: 100vh
  flex-direction: column
  
  .app-content
    flex: 1
  
  .crumbs
    padding: 0 1.5rem

</style>
