<template lang="pug">
.device-created-block
  .has-text-centered
    article.message.is-success
      .message-header
        | Device created
      .message-body
        p.is-size-5
          | #[strong {{userDevice | userDeviceName}}] was created with device
          | #[code {{userDevice.macAddress}}]
    .buttons.is-centered
      button.button.is-success.is-medium(@click="$emit('restart')")
        span Add another
      router-link.button.is-link.is-medium(:to="filesRoute")
        span Deployment Files
</template>

<script>

/* Events:

@restart () -> When the user presses restart to add another device

*/

import { ROUTES } from '@/constants'

export default {
  props: {
    deployment: { type: Object, required: true },
    userDevice: { type: Object, required: true }
  },
  computed: {
    filesRoute () {
      const params = { deployment_id: this.deployment.id }
      return { name: ROUTES.DEPLOYMENT_FILES, params }
    },
    usersRoute () {
      const params = { deployment_id: this.deployment.id }
      return { name: ROUTES.DEPLOYMENT_USERS, params }
    }
  }
}
</script>

<style lang="css">
</style>
