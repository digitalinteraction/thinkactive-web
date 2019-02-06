<template lang="pug">
.tablet-error-page
  section.section.is-large
    half-width
      article.message.is-danger.is-large
        .message-header
          p Send for help – {{ message.title }}
        .message-body.has-text-centered
          p.is-size-4 {{ message.body }} Grab your teacher and ask them for help
      .buttons.is-centered
        button.button.is-link.is-large(@click="resetScreen")
          .icon: fa(icon="sync-alt")
          span Try again
</template>

<script>
import { ROUTES, TABLET_ERROR } from '@/constants'
import { DeploymentParamMixin, TimersMixin } from '@/mixins'

import HalfWidth from '@/components/layout/HalfWidth'
import BackButtonBlock from '@/components/block/BackButtonBlock'

const messages = {
  [TABLET_ERROR.UNKNOWN_USER]: {
    title: 'Missing Device',
    body: 'I could not find your device, has it run out of charge?'
  },
  [TABLET_ERROR.SYNC_FAILED]: {
    title: 'Sync Failed',
    body: 'I could not get your data, are you still there?'
  },
  [TABLET_ERROR.FETCH_FAILED]: {
    title: 'Fetch Failed',
    body: 'I could not grab your data, ... ?!?!?'
  }
}

export default {
  components: { HalfWidth, BackButtonBlock },
  mixins: [ DeploymentParamMixin, TimersMixin ],
  computed: {
    message () {
      return messages[this.$route.params.error_type] || {
        title: 'Oh dear',
        body: 'Something went wrong.'
      }
    }
  },
  timeouts: {
    resetScreen: 30000
  },
  methods: {
    resetScreen () {
      this.$router.push({
        name: ROUTES.TABLET_HOME,
        params: { deployment_id: this.deploymentId }
      })
    }
  }
}
</script>

<style lang="sass">
</style>
