<template lang="pug">
.new-deployment-info-page
  section.section
    third-width
      h2.title Deployment Information
      deployment-info-form(
        v-if="$store.state.newDeployment"
        :initial="$store.state.newDeployment.info"
        @submit="submit",
        @cancel="cancel"
        submit-button="Next",
        cancel-button="Cancel"
      )
</template>

<script>
import { ROUTES, MUTATIONS } from '@/constants'
import DeploymentInfoForm from '@/components/form/DeploymentInfoForm'
import ThirdWidth from '@/components/layout/ThirdWidth'

export default {
  components: { DeploymentInfoForm, ThirdWidth },
  methods: {
    submit (info) {
      this.$store.commit(MUTATIONS.UPDATE_NEW_DEPLOYMENT, { info })
      this.$router.push({ name: ROUTES.NEW_DEPLOYMENT_DEVICES })
    },
    cancel () {
      this.$router.push({ name: ROUTES.DASH_HOME }, () => {
        this.$store.commit(MUTATIONS.CLEAR_NEW_DEPLOYMENT)
      })
    }
  }
}
</script>

<style lang="css">
</style>
