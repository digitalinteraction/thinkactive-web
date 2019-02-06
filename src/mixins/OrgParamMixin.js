/*
 * @vue/component
 * A mixin for components to parse the organisation id from the url param 'org_id'
 */
export default {
  computed: {
    orgId () {
      return parseInt(this.$route.params.org_id)
    },
    organisation () {
      return this.$store.getters.orgById(this.orgId)
    }
  }
}
