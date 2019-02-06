<template lang="pug">
.deployment-tabs-page
  .container
    .tabs.is-medium
      ul
        li(v-for="tab in tabs", :class="tabClasses(tab)")
          router-link(:to="{name: tab.route}")
            .icon.is-small(v-if="tab.icon")
              fa(:icon="tab.icon", size="sm")
            span {{tab.name}}
  router-view
</template>

<script>
import { ROUTES } from '@/constants'
import { OrgParamMixin, DeploymentParamMixin } from '@/mixins'

export default {
  mixins: [ OrgParamMixin, DeploymentParamMixin ],
  computed: {
    tabs () {
      return [
        { route: ROUTES.DEPLOYMENT, name: 'Info', icon: ['far', 'calendar-alt'] },
        { route: ROUTES.DEPLOYMENT_USERS, name: 'Users', icon: 'users' },
        { route: ROUTES.DEPLOYMENT_CHALLENGES, name: 'Challenges', icon: 'star' },
        { route: ROUTES.DEPLOYMENT_FILES, name: 'Files', icon: 'file' },
        { route: ROUTES.DEPLOYMENT_VIEWS, name: 'Views', icon: 'desktop' },
        { route: ROUTES.DEPLOYMENT_DATA, name: 'Data', icon: 'chart-bar' }
      ]
    }
  },
  methods: {
    tabClasses (tab) {
      return {
        'is-active': this.$route.name === tab.route
      }
    }
  }
}
</script>

<style lang="css">
</style>
