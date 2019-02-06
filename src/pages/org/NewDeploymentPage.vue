<template lang="pug">
.new-deployment-page
  section.hero.is-primary
    .hero-body
      .container
        h1.title Create Deployment
        h2.subtitle This is the processes for creating a new deployment of ThinkActive
  router-view(@submit="submit")
</template>

<script>
import { ROUTES, MUTATIONS } from '@/constants'
import { SplashMessageBus } from '@/busses'

export default {
  data () {
    return { isSubmitting: false }
  },
  mounted () {
    if (!this.$store.state.newDeployment) {
      this.$store.commit(MUTATIONS.START_NEW_DEPLOYMENT)
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.isSubmitting) {
      next()
    } else {
      let confirmed = confirm('Are you sure you want to leave? Your deployment has not been created yet')
      if (confirmed) next()
      else next(false)
    }
  },
  methods: {
    async submit () {
      let info = this.$store.state.newDeployment.info
      let devices = this.$store.state.newDeployment.devices

      info.organisationId = parseInt(this.$route.params.org_id)

      let confirmed = confirm(`You have linked ${devices.length} devices, is that enough for your deployment?`)
      if (!confirmed) return

      this.isSubmitting = true
      let { meta, data } = await this.$api.createDeployment(info, devices)

      if (meta.success) {
        this.$store.commit(MUTATIONS.DEPLOYMENTS, [ data ])
        this.$store.commit(MUTATIONS.CLEAR_NEW_DEPLOYMENT)
        let params = { deployment_id: data.id }
        this.$router.push({ name: ROUTES.DEPLOYMENT_FILES, params })
        SplashMessageBus.$emit('message', {
          body: 'Deployment Created!',
          type: 'success'
        })
      } else {
        // TODO: ...
        console.log('failed', meta.messages)
      }
      this.isSubmitting = false
    }
  }
}
</script>

<style>
</style>
