<template lang="pug">
section.section.deploy-views-page
  .container
    h1.title Views
    h2.subtitle The different ways you can view the deployment
    .buttons
      router-link.button.is-large.is-link(:to="tabletRoute")
        .icon
          fa(icon="tablet-alt", size="sm")
        span Tablet
      router-link.button.is-large.is-link(:to="presentRoute")
        .icon
          fa(icon="tv", size="sm")
        span Present
</template>

<script>
import { ROUTES } from '@/constants'
import { OrgParamMixin, DeploymentParamMixin } from '@/mixins'

export default {
  mixins: [ OrgParamMixin, DeploymentParamMixin ],
  computed: {
    tabletRoute () {
      let params = { deployment_id: this.deployment.id }
      return { name: ROUTES.TABLET_HOME, params }
    },
    presentRoute () {
      let params = { deployment_id: this.deployment.id }
      return { name: ROUTES.PRESENT_HOME, params }
    }
  }
}
</script>

<style lang="css">
</style>
