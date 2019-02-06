<template lang="pug">
.deployment-add-user-page
  back-button-block(:to="backRoute")
  section.section
    half-width
      h1.title Add a user
      h2.subtitle Link another device to the deployment
      p
        | Use this form to link an extra device to the deployment and create a new user.
        | Once you have linked a new device, you can download the updated deployment docs.
      hr.is-medium
      api-block(
        :endpoint="fetchDevices",
        v-model="allDevices",
        loading="Fetching Devices"
      )
      loading(v-if="inProgress", title="Creating User")
      error-message(v-else-if="messages.length > 0", v-model="messages", @reset="restart")
      user-device-created-block(
        v-else-if="newUserDevice",
        :deployment="deployment",
        :user-device="newUserDevice",
        @restart="restart"
      )
      template(v-else-if="allDevices")
        device-confirm-block(
          v-if="linkedDevice",
          :device="linkedDevice",
          @cancel="linkedDevice = null",
          @confirm="confirmDevice"
        )
        device-form(
          v-else,
          :all-devices="allDevices",
          :linked="previousDevices",
          @added="linkDevice",
          device-action="choose"
        )
</template>

<script>
import { ROUTES } from '@/constants'
import { OrgParamMixin, DeploymentParamMixin } from '@/mixins'
import DeviceForm from '@/components/form/DeviceForm'
import ApiBlock from '@/components/layout/ApiBlock'
import HalfWidth from '@/components/layout/HalfWidth'
import Loading from '@/components/layout/Loading'
import ErrorMessage from '@/components/layout/ErrorMessage'

import DeviceConfirmBlock from '@/components/block/DeviceConfirmBlock'
import UserDeviceCreatedBlock from '@/components/block/UserDeviceCreatedBlock'
import BackButtonBlock from '@/components/block/BackButtonBlock'

export default {
  components: {
    DeviceForm, ApiBlock, HalfWidth, Loading, ErrorMessage, UserDeviceCreatedBlock, DeviceConfirmBlock, BackButtonBlock
  },
  mixins: [ OrgParamMixin, DeploymentParamMixin ],
  data () {
    return {
      allDevices: null, linkedDevice: null, newUserDevice: null, messages: [], inProgress: false, previousDevices: []
    }
  },
  computed: {
    filesRoute () {
      const params = { deployment_id: this.deployment.id }
      return { name: ROUTES.DEPLOYMENT_FILES, params }
    },
    backRoute () {
      const params = { deployment_id: this.deployment.id }
      return { name: ROUTES.DEPLOYMENT_USERS, params }
    }
  },
  methods: {
    fetchDevices () {
      return this.$api.availableDevices(this.orgId)
    },
    linkDevice (device) {
      this.linkedDevice = device
    },
    restart () {
      this.previousDevices.push(this.linkedDevice)
      this.linkedDevice = null
      this.newUserDevice = null
    },
    async confirmDevice () {
      if (!this.linkedDevice || this.inProgress) return
      this.inProgress = true
      this.messages = []
      let { meta, data } = await this.$api.addDeviceToDeployment(
        this.deployment.id, this.linkedDevice.id
      )
      this.messages = meta.messages
      this.newUserDevice = data
      if (!meta.success && meta.messages.length === 0) {
        this.messages.push('Something went wrong, please try again')
      }
      this.inProgress = false
    }
  }
}
</script>

<style lang="css">
</style>
