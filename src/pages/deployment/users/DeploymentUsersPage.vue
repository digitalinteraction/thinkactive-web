<template lang="pug">
section.section.deployment-users-page
  .container
    .level
      .level-left
        .level-item
          div
            h1.title Users
            p.is-size-5
              | This deployment has {{userCount}} users
              a.is-size-7.is-unselectable(@click.prevent="refresh")  (refresh)
      .level-right
        .level-item
          .field.has-addons
            .control
              input.input(type="text", v-model="query", placeholder="Search Users ...")
            .control
              button.button.is-static
                fa(icon="search")
        //- .level-item.is-marginless
          router-link.button.is-success(:to="addRoute")
            span.icon: fa(icon="plus")
            span Add User
    api-block(
      ref="users",
      :endpoint="fetchUsers",
      v-model="deploymentUsers",
      loading="Fetching Users"
    )
    deployment-users-table(
      v-if="filteredDeploymentUsers",
      :deployment-users="filteredDeploymentUsers",
      @action="editDeploymentUser"
    )
    //- deployment-users-table(
    //-   v-if="filteredDeploymentUsers",
    //-   :deployment-users="filteredDeploymentUsers",
    //-   mode="edit",
    //-   @action="editDeploymentUser"
    //- )
</template>

<script>
import { ROUTES } from '@/constants'
import { OrgParamMixin, DeploymentParamMixin } from '@/mixins'
import ApiBlock from '@/components/layout/ApiBlock'
import DeploymentUsersTable from '@/components/table/DeploymentUsersTable'
// import DeploymentUsersToolbar from '@/components/block/DeploymentUsersToolbarBlock'

export default {
  components: { ApiBlock, DeploymentUsersTable },
  mixins: [ OrgParamMixin, DeploymentParamMixin ],
  data () {
    return {
      query: '',
      deploymentUsers: null,
      addRoute: { name: ROUTES.DEPLOYMENT_ADD_USER }
    }
  },
  computed: {
    userCount () {
      return this.deploymentUsers ? this.deploymentUsers.length : '~'
    },
    filteredDeploymentUsers () {
      if (!this.deploymentUsers) return null
      let query = new RegExp(this.query, 'i')
      return (this.deploymentUsers || []).filter(dplUser => {
        return query.test(dplUser.animal) ||
          query.test(dplUser.colour) ||
          query.test(dplUser.macAddress.replace(/:/g, '')) ||
          query.test(dplUser.macAddress)
      })
    }
  },
  methods: {
    refresh () {
      this.$refs.users.refresh()
    },
    fetchUsers () {
      return this.$api.getDeploymentUsers(this.deployment.id)
    },
    editDeploymentUser (deploymentUser) {
      const params = { deployment_id: this.deployment.id, user_device_id: deploymentUser.id }
      const route = { name: ROUTES.DEPLOYMENT_EDIT_USER, params }
      this.$router.push(route)
    }
  }
}
</script>

<style lang="css">
</style>
