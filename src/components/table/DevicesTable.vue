<template lang="pug">
table.table.device-list.is-fullwidth
  tbody
    tr(v-for="device in devices")
      td.is-size-5 {{device.macAddress}}
      td.has-text-right(v-if="action")
        button.button(@click="executeAction(device)", :class="actionClass")
          .icon
            fa(:icon="actionIcon")
          span {{actionName}}
</template>

<script>

/* Events:

@perform-action (device) -> When a device's action was clicked

*/

const ActionClassMap = {
  choose: 'is-link',
  link: 'is-primary',
  unlink: 'is-danger'
}
const ActionIconMap = {
  choose: 'link',
  link: 'link',
  unlink: 'unlink'
}
const ActionNameMap = {
  choose: 'Choose',
  link: 'Link',
  unlink: 'Unlink'
}

export default {
  props: {
    devices: { type: Array, required: true },
    action: { type: String, default: null }
  },
  computed: {
    actionClass () { return ActionClassMap[this.action] },
    actionIcon () { return ActionIconMap[this.action] },
    actionName () { return ActionNameMap[this.action] }
  },
  methods: {
    executeAction (device) {
      this.$emit('perform-action', device)
    }
  }
}
</script>

<style lang="css">
</style>
