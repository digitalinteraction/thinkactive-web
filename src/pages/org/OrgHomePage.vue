<template lang="pug">
.org-home-page
  hero.is-primary
    .container
      h1.title {{org.name}}
      h2.subtitle Here are the tools you need to manage this organisation

  section.section
    .container
      dash-toolbar-block(
        :query.sync="query"
      )

      template(v-if="deployments")
        h2.subtitle Deployments
        p(v-if="deployments.length === 0")
          | You don't have any deployments yet, create one?
        deployments-table(
          v-else,
          :deployments="filteredDeployments",
          action="Manage",
          @choose="choseDeployment"
        )
</template>

<script>
import { ROUTES } from '@/constants'
import { AuthMixin } from '@/mixins'
import Loading from '@/components/layout/Loading'
import ErrorMessage from '@/components/layout/ErrorMessage'
import ButtonControl from '@/components/layout/ButtonControl'
import NavControl from '@/components/layout/NavControl'
import Control from '@/components/layout/Control'
import Hero from '@/components/layout/Hero'

import DeploymentsTable from '@/components/table/DeploymentsTable'
import DashToolbarBlock from '@/components/block/DashToolbarBlock'

export default {
  components: { Loading, ErrorMessage, ButtonControl, NavControl, Control, DeploymentsTable, DashToolbarBlock, Hero },
  mixins: [ AuthMixin ],
  data () {
    return {
      query: '',
      messages: [],
      newDeployment: { name: ROUTES.NEW_DEPLOYMENT }
    }
  },
  computed: {
    org () {
      return this.$store.getters.orgById(this.$route.params.org_id)
    },
    deployments () {
      return this.$store.getters.deploymentsForOrg(this.$route.params.org_id)
    },
    filteredDeployments () {
      if (!this.deployments) return []
      let query = this.query.toLowerCase()
      return this.deployments.filter(d => {
        return d.name.toLowerCase().includes(query) ||
          d.location.toLowerCase().includes(query) ||
          d.pointOfContact.toLowerCase().includes(query)
      })
    }
  },
  methods: {
    choseDeployment (deployment) {
      this.$router.push({
        name: ROUTES.DEPLOYMENT,
        params: { deployment_id: deployment.id }
      })
    },
    refresh () {
      this.$refs.deployments.refresh()
    }
  }
}
</script>

<style>
</style>
