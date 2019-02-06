import casex from 'casex'

/*
 * @vue/component
 * A mixin for components that have / load a DeploymentUser froma url parameter
 * looks for an id using `$route.params.deployment_user_id`
 */
export default {
  computed: {
    deploymentUserId () {
      return parseInt(this.$route.params.deployment_user_id)
    },
    deploymentUser () {
      return this.$store.getters.deploymentUserById(this.deploymentUserId)
    },
    deviceName () {
      if (!this.deploymentUser) return '~'
      let colour = casex(this.deploymentUser.colour, 'Ca se')
      let animal = casex(this.deploymentUser.animal, 'Ca se')
      return `${colour} ${animal}`
    }
  }
}
