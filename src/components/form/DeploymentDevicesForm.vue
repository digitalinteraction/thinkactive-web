<template lang="pug">
.deployment-devices-form
  .columns
    .column
      device-form(
        :all-devices="allDevices",
        :linked="linked",
        @added="linkDevice",
        deviceAction="link"
      )
    
    .column
      label.label Linked Devices
      p(v-if="linked.length === 0")
        | You have not linked any devices yet
      devices-table(
        v-else
        :devices="linked",
        action="unlink",
        @perform-action="unlinkDevice"
      )
  
  hr
  
  h2.subtitle.has-text-centered
    | You have linked {{linked.length}} devices, is that enough?
  .buttons.is-centered
    button.button.is-text(v-if="cancelButton", @click="cancel") {{cancelButton}}
    button.button.is-primary(v-if="submitButton", @click="submit", :disabled="!canSubmit") {{submitButton}}
</template>

<script>

/* Events:

@submit () -> When the user submits the form
@camcel () -> When the user cancels the submission

*/

import DevicesTable from '@/components/table/DevicesTable'
import DeviceForm from '@/components/form/DeviceForm'

export default {
  components: { DevicesTable, DeviceForm },
  props: {
    allDevices: { type: Array, required: true },
    initial: { type: Array, required: true },
    cancelButton: { type: String, default: null },
    submitButton: { type: String, default: null }
  },
  data () {
    return {
      newDevice: '',
      linked: Array.from(this.initial)
    }
  },
  computed: {
    notLinked () {
      return this.allDevices.filter(device => {
        return !this.linked.includes(device)
      })
    },
    available () {
      // Return nothing if theres no query
      let query = this.newDevice.toLowerCase()
      if (query === '') return []
      
      // Return the top 5 matches
      return this.notLinked.filter(device => {
        let lowerMacAddr = device.macAddress.toLowerCase()
        return lowerMacAddr.includes(query) ||
          lowerMacAddr.replace(/:/g, '').includes(query)
      }).slice(0, 5)
    },
    canSubmit () {
      return this.linked.length > 0
    }
  },
  methods: {
    unlinkDevice (toRemove) {
      this.linked = this.linked.filter(device => {
        return device.macAddress !== toRemove.macAddress
      })
    },
    linkDevice (toAdd) {
      this.linked.push(toAdd)
      this.newDevice = ''
    },
    submit () {
      this.$emit('submit', this.linked)
    },
    cancel () {
      this.$emit('cancel', this.linked)
    }
  }
}
</script>

<style lang="css">
</style>
