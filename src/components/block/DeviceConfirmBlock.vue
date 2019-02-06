<template lang="pug">
.device-confirm-block
  .message
    .message-header
      p Add New Device?
    .message-body.has-text-centered
      p.is-size-5
        | Create a new user with this device, #[code {{device.macAddress}}] ?
  .buttons.is-centered
    button.button.is-danger.is-medium(@click="$emit('cancel')") Cancel
    button.button.is-success.is-medium(@click="$emit('confirm')") Create
</template>

<script>

/* Events:

@cancel  () -> When the user presses cancel
@confirm () -> When the user presses create

*/

export default {
  props: {
    device: { type: Object, required: true }
  }
}
</script>

<style lang="css">
</style>
