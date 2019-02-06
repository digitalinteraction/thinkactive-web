e<template lang="pug">
.user-devices-grid.columns.is-multiline
  .column.is-one-third.is-light(v-for="(deploymentUser, i) in deploymentUsers")
    article.box(@click="vibrateDevice(deploymentUser)")
      .media
        .media-left
          square-svg.has-filter-shadow(width="54px", height="54px")
            device-avatar(:deployment-user="deploymentUser", :size="60")
        .media-content.is-clipped
          p.title.is-5 {{deploymentUser | userDeviceName}}
          p.subtitle.is-7 {{deploymentUser.macAddress || '~~:~~:~~:~~:~~'}}
        .media-right(v-if="mode")
          button.button.is-small(
            @click="performAction(deploymentUser)",
            :class="action.classes"
          )
            span.icon.is-small(v-if="action.icon")
              fa(:icon="action.icon", size="sm")
            span(v-if="action.name") {{action.name}}
</template>

<script>

/* Events:

@action (deploymentUser) -> When a deployment user's action was clicked

*/

import { NATIVE_EVENTS } from '@/constants'
import SquareSvg from '@/components/tablet/SquareSvg'
import DeviceAvatar from '@/components/tablet/DeviceAvatar'

const Actions = {
  edit: {
    name: 'Edit', classes: 'is-info', _icon: 'pencil-alt'
  }
}

export default {
  components: { SquareSvg, DeviceAvatar },
  props: {
    deploymentUsers: {
      type: Array,
      required: true
    },
    mode: {
      type: String,
      default: null,
      validator: v => !!Actions[v]
    }
  },
  computed: {
    action () { return Actions[this.mode] }
  },
  methods: {
    performAction (deploymentUser) {
      this.$emit('action', deploymentUser)
    },
    vibrateDevice (deploymentUser) {
      this.$native.$emit(
        NATIVE_EVENTS.VIBRATE_DEVICE,
        deploymentUser.macAddress
      )
    }
  }
}
</script>

<style lang="css">
</style>
