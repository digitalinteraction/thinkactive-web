<template lang="pug">
.deployment-page
  template(v-if="messages.length > 0")
    hero.is-primary
      .container
        h1.title Something went wrong
    section.section
      .container
        error-message(:value="messages", fixed)
  
  template(v-else-if="!deployment || loading")
    hero.is-primary
      .container
        h1.title Loading Deployment
        h2.subtitle Fetching Information ...
    loading(title="Fetching Deployment")
  
  template(v-else)
    hero.is-primary
      .container
        h1.title {{deployment.name}}
        h2.subtitle {{deployment.location}} &ndash; {{deployment.pointOfContact}}
    router-view()
</template>

<script>
import { OrgParamMixin, DeploymentParamMixin } from '@/mixins'

import Hero from '@/components/layout/Hero'
import Loading from '@/components/layout/Loading'
import ErrorMessage from '@/components/layout/ErrorMessage'

export default {
  components: { Hero, Loading, ErrorMessage },
  mixins: [ OrgParamMixin, DeploymentParamMixin ],
  data () {
    return { messages: [], loading: false }
  },
  watch: {
    '$route.params.deployment_id' () { this.fetchDeployment() }
  },
  async mounted () {
    this.loading = true
    let { meta } = await this.fetchDeployment()
    this.messages = meta.messages
    this.loading = false
  }
}
</script>

<style>
</style>
