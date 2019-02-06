<template lang="pug">
.device-form
  control.is-expanded(:label="label")
    input.input(
      type="text"
      v-model="newDevice",
      placeholder="e.g. 11:22:33:44:55:66"
    )
    p.help(v-if="newDevice === ''")
      | Start typing to link devices, {{notLinked.length}} devices available
    p.help.is-danger(v-else-if="available.length === 0")
      | No devices match that query
    devices-table(
      v-else,
      :devices="available"
      :action="deviceAction",
      @perform-action="linkDevice"
    )
</template>

<script>

/* Events:

@added () -> When the user linked a device

*/

import Control from '@/components/layout/Control'
import DevicesTable from '@/components/table/DevicesTable'

export default {
  components: { Control, DevicesTable },
  props: {
    allDevices: { type: Array, required: true },
    linked: { type: Array, required: true },
    deviceAction: { type: String, required: true },
    label: { type: String, default: 'Available Devices' }
  },
  data () {
    return { newDevice: '' }
  },
  computed: {
    notLinked () {
      return this.allDevices.filter(device => {
        return !this.linked.includes(device)
      })
    },
    available () {
      // Return nothing if theres no query
      let query = this.newDevice.toLowerCase().trim()
      if (query === '') return []
      
      // Return the top 5 matches
      return this.notLinked.filter(device => {
        let lowerMacAddr = device.macAddress.toLowerCase()
        return lowerMacAddr.includes(query) ||
          lowerMacAddr.replace(/:/g, '').includes(query)
      }).slice(0, 5)
    }
  },
  methods: {
    linkDevice (device) {
      this.$emit('added', device)
      this.newDevice = ''
    }
  }
}
</script>

<style lang="css">
</style>
