<template lang="pug">
.container(v-if="messages.length > 0")
  section.section
    error-message(:value="messages", fixed)
loading(v-else-if="loading", title="Fetching Organisation")
.org-root-page(v-else-if="org")
  router-view
</template>

<script>
import { MUTATIONS } from '@/constants'
import Loading from '@/components/layout/Loading'
import ErrorMessage from '@/components/layout/ErrorMessage'

export default {
  components: { Loading, ErrorMessage },
  data () {
    return {
      messages: [],
      loading: false
    }
  },
  computed: {
    org () {
      return this.$store.getters.orgById(this.$route.params.org_id)
    }
  },
  watch: {
    '$route.params.org_id' () {
      this.fetchData()
    }
  },
  mounted () {
    if (!this.org) {
      this.fetchData()
    }
  },
  methods: {
    async fetchData () {
      this.loading = true
      let [ orgRes, depsRes ] = await Promise.all([
        this.$api.getOrg(this.$route.params.org_id),
        this.$api.listDeployments(this.$route.params.org_id)
      ])

      this.messages = orgRes.meta.messages.concat(depsRes.meta.messages)

      this.$store.commit(MUTATIONS.ORGS, [ orgRes.data ])
      this.$store.commit(MUTATIONS.DEPLOYMENTS, depsRes.data)

      if (this.messages.length === 0 && !this.org) {
        this.messages.push('Organisation not found')
      }
      this.loading = false
    }
  }
}
</script>

<style lang="css">
</style>
