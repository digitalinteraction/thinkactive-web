<template lang="pug">
.control-wrapper
  label.label(v-if="label") {{label}}
  .control(:class="controlClasses")
    slot
    .icon.is-left(v-if="leftIcon")
      fa(:icon="leftIcon")
    .icon.is-right(v-if="rightIcon")
      fa(:icon="rightIcon")
</template>

<script>
export default {
  props: {
    label: { type: String, default: null },
    leftIcon: { type: [String, Array], default: null },
    rightIcon: { type: [String, Array], default: null }
  },
  computed: {
    controlClasses () {
      return {
        'has-icons-left': !!this.leftIcon,
        'has-icons-right': !!this.rightIcon
      }
    }
  }
}
</script>

<style lang="css">
</style>
