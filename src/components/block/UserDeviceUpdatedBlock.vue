<template lang="pug">
.user-device-updated-block
  article.message.is-success
    .message-header
      p User Updated
    .message-body.has-text-centered
      p.is-size-4
        | {{userDevice | userDeviceName}}'s device was set to
        strong  {{userDevice.macAddress}}
  .buttons.is-right
    router-link.button.is-link(:to="backRoute")
      span Back to Deployment
      span.icon.is-small
        fa(icon="chevron-right")
</template>

<script>
export default {
  props: {
    userDevice: { type: Object, required: true },
    backRoute: { type: [ Object, String ], required: true }
  }
}
</script>

<style lang="css">
</style>
