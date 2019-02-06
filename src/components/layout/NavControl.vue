<template lang="pug">
.control
  router-link.button(:to="to", :class="modifiers")
    template(v-if="icon")
      .icon
        fa(:icon="icon")
      span
        slot
    template(v-else)
      slot
</template>

<script>
export default {
  props: {
    icon: { type: String, default: null },
    modifiers: { type: String, default: '' },
    to: { type: [String, Array, Object], required: true }
  }
}
</script>

<style lang="css">
</style>
