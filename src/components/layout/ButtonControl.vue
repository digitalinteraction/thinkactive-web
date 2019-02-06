<template lang="pug">
.control
  button.button(:class="modifiers", @click="$e => $emit('click', $e)", :disabled="disabled")
    template(v-if="icon")
      .icon
        fa(:icon="icon")
      span
        slot
    template(v-else)
      slot
</template>

<script>

/* Events:

@click (event) -> When the button is clicked,
  allows the control to be used like a HTMLElement

 */

export default {
  props: {
    icon: { type: [String, Array], default: null },
    modifiers: { type: String, default: '' },
    disabled: { type: Boolean, default: false }
  }
}
</script>

<style lang="css">
</style>
