<template lang="pug">
.new-deployment-devices-page
  section.section
    third-width
      h2.title Link Devices
      api-block(:endpoint="fetchAvailableDevices", v-model="availableDevices", loading="Fetching available devices")
      deployment-devices-form(
        v-if="availableDevices",
        :all-devices="availableDevices",
        :initial="linkedDevices",
        @submit="submit",
        @cancel="cancel",
        submit-button="Create",
        cancel-button="Back"
      )
</template>

<script>
import { MUTATIONS } from '@/constants'
import { OrgParamMixin } from '@/mixins'
import DeploymentDevicesForm from '@/components/form/DeploymentDevicesForm'
import ApiBlock from '@/components/layout/ApiBlock'
import ThirdWidth from '@/components/layout/ThirdWidth'

export default {
  components: { DeploymentDevicesForm, ApiBlock, ThirdWidth },
  mixins: [ OrgParamMixin ],
  data () {
    return {
      messages: [],
      availableDevices: null
    }
  },
  computed: {
    linkedDevices () {
      return this.$store.state.newDeployment &&
        this.$store.state.newDeployment.devices
    }
  },
  methods: {
    async fetchAvailableDevices () {
      let { meta, data } = await this.$api.availableDevices(this.orgId)
      if (meta.success && data.length === 0) {
        meta.success = false
        meta.messages.push('There are no devices available right now')
      }
      return { meta, data }
    },
    async submit (devices) {
      this.$store.commit(MUTATIONS.UPDATE_NEW_DEPLOYMENT, { devices })
      this.$emit('submit')
    },
    cancel (devices) {
      this.$store.commit(MUTATIONS.UPDATE_NEW_DEPLOYMENT, { devices })
      this.$router.back()
    }
  }
}
</script>

<style lang="css">
</style>
