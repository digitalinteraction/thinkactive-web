<template lang="pug">
.update-user-device-confirm-block
  article.message
    .message-header
      p Change Device?
    .message-body.has-text-centered
      p.is-size-5
        | Set {{userDevice.colour}} {{userDevice.animal}}'s device to #[strong {{newDevice.macAddress}}]?
    
  .buttons.is-centered
    button.button.is-danger.is-medium(@click="$emit('cancel')") Cancel
    button.button.is-success.is-medium(@click="$emit('confirm')") Confirm
</template>

<script>

/* Events:

@cancel  () -> When the user presses cancel
@confirm () -> When the user presses confirm

*/

export default {
  props: {
    userDevice: { type: Object, required: true },
    newDevice: { type: Object, required: true }
  }
}
</script>

<style lang="css">
</style>
