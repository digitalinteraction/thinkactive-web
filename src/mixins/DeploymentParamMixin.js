import { ROUTES, MUTATIONS } from '@/constants'

/*
 * @vue/component
 * A mixin for components to have / load a deployment from a url parameter
 * looks for an id using `$route.params.deployment_id`
 */
export default {
  computed: {
    deployment () {
      return this.$store.getters.deploymentById(this.$route.params.deployment_id)
    },
    deploymentId () {
      return parseInt(this.$route.params.deployment_id)
    },
    deploymentRoute () {
      if (!this.deployment) return { name: ROUTES.HOME }
      return {
        name: ROUTES.DEPLOYMENT,
        params: this.deploymentRouteParams()
      }
    },
    deploymentViewRoute () {
      if (!this.deployment) return { name: ROUTES.HOME }
      return {
        name: ROUTES.DEPLOYMENT_VIEWS,
        params: this.deploymentRouteParams()
      }
    },
    deploymentChallengesRoute () {
      if (!this.deployment) return { name: ROUTES.HOME }
      return {
        name: ROUTES.DEPLOYMENT_CHALLENGES,
        params: this.deploymentRouteParams()
      }
    }
  },
  methods: {
    async fetchDeployment () {
      let { meta, data } = await this.$api.getDeployment(this.deploymentId)
      if (meta.success) {
        this.$store.commit(MUTATIONS.DEPLOYMENTS, [ data ])
      } else if (meta.messages.length === 0) {
        meta.messages = [ 'Deployment not found' ]
      }
      return { meta, data }
    },
    async fetchDeploymentUsers () {
      let { meta, data } = await this.$api.getDeploymentUsers(this.deploymentId)
      if (meta.success) {
        console.info(data)
        data.forEach(d => (d.deploymentId = this.deploymentId))
        this.$store.commit(MUTATIONS.DEPLOYMENT_USERS, data || [])
      } else if (meta.messages.length === 0) {
        meta.messages = [ 'Deployment Users not found' ]
      }
      return { meta, data }
    },
    deploymentRouteParams () {
      return {
        org_id: this.deployment.organisationId,
        deployment_id: this.deployment.id
      }
    }
  }
}
