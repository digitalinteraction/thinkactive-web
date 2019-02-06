<template lang="pug">
.deployment-edit-page
  back-button(:to="backRoute")
  section.section
    half-width
      api-block(
        :endpoint="fetchUsers",
        v-model="allUsers",
        loading="Fetching User"
      )
      .message.is-danger(v-if="allUsers && !userDevice")
        .message-header: p User Not Found
        .message-body
          p Could not find that user, if you typed the url make sure its correct.
      template(v-else-if="userDevice")
        h1.title Change User's Device
        h2.subtitle You are editing &quot;{{userDevice | userDeviceName}}&quot;
        p.is-size-5
          | #[small Current Device] #[strong {{userDevice.macAddress}}]
        hr.is-medium
        
        api-block(
          :endpoint="fetchDevices",
          v-model="allDevices",
          loading="Fetching Devices"
        )
        
        template(v-if="allDevices")
          loading(v-if="inProgress", title="Updating User", size="small")
          error-message(
            v-else-if="messages.length > 0",
            v-model="messages",
            @reset="restart"
          )
          user-device-updated(
            v-else-if="updated",
            :user-device="userDevice",
            :back-route="backRoute"
          )
          update-user-device-confirm(
            v-else-if="linkedDevice",
            :user-device="userDevice",
            :new-device="linkedDevice",
            @cancel="restart",
            @confirm="confirm"
          )
          device-form(
            v-else,
            :all-devices="allDevices",
            :linked="[]",
            @added="d => linkedDevice = d",
            label="Link a new device",
            device-action="choose"
          )
</template>

<script>
import { ROUTES } from '@/constants'
import { OrgParamMixin, DeploymentParamMixin } from '@/mixins'
import HalfWidth from '@/components/layout/HalfWidth'
import ApiBlock from '@/components/layout/ApiBlock'
import DeviceForm from '@/components/form/DeviceForm'
import Loading from '@/components/layout/Loading'
import ErrorMessage from '@/components/layout/ErrorMessage'

import BackButton from '@/components/block/BackButtonBlock'
import UserDeviceUpdated from '@/components/block/UserDeviceUpdatedBlock'
import UpdateUserDeviceConfirm from '@/components/block/UpdateUserDeviceConfirmBlock'

export default {
  components: {
    HalfWidth, ApiBlock, DeviceForm, Loading, ErrorMessage, BackButton, UserDeviceUpdated, UpdateUserDeviceConfirm
  },
  mixins: [ OrgParamMixin, DeploymentParamMixin ],
  data () {
    return { allUsers: null, allDevices: null, linkedDevice: null, inProgress: false, messages: [], updated: false }
  },
  computed: {
    userDevice () {
      let id = parseInt(this.$route.params.user_device_id)
      return (this.allUsers || [])
        .find(ud => ud.id === id)
    },
    backRoute () {
      let params = { deployment_id: this.deployment.id }
      return { name: ROUTES.DEPLOYMENT_USERS, params }
    }
  },
  methods: {
    fetchUsers () {
      return this.$api.getDeploymentUsers(this.deployment.id)
    },
    fetchDevices () {
      return this.$api.availableDevices(this.orgId)
    },
    linkDevice (device) {
      console.log(device)
    },
    restart () {
      this.linkedDevice = null
      this.updated = false
    },
    async confirm () {
      if (this.inProgress || !this.linkedDevice || !this.userDevice) return
      this.inProgress = true
      let { meta } = await this.$api.updateDeploymentUserDevice(
        this.deployment.id, this.userDevice.id, this.linkedDevice.id
      )
      this.messages = meta.messages
      this.updated = meta.success
      this.userDevice.macAddress = this.linkedDevice.macAddress
      this.inProgress = false
    }
  }
}
</script>

<style lang="css">
</style>
