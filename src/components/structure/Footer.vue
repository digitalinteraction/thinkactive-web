<template lang="pug">
footer.footer
  .container
    .content.has-text-centered
      p
        strong ThinkActive
        |  is a project by
        a(href="https://openlab.ncl.ac.uk/", target="_blank")  Open Lab
        |  at Newcastle University
        span.has-text-grey-light(v-if="name && version")
          |  &mdash;
          |  {{ name }}@{{ version }}
</template>

<script>
import { ConfigMixin } from '@/mixins'

export default {
  mixins: [ ConfigMixin ],
  computed: {
    name () {
      return this.getConfig('PACKAGE_NAME')
    },
    version () {
      return this.getConfig('PACKAGE_VERSION')
    }
  }
}
</script>

<style lang="sass">
</style>
