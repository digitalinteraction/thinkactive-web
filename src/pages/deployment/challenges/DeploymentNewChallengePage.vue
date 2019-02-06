<template lang="pug">
.deployment-new-challenge-page
  back-button-block(:to="deploymentChallengesRoute")
  section.section
    third-width
      h2.title New Challenge
      h3.subtitle Enter details to create a challenge
      error-message(v-model="errors")
      challenge-form(
        :initial="challenge",
        :is-new="true",
        :disabled="inProgress",
        @submit="submit",
        @cancel="cancel",
        submit-action="Create",
        cancel-action="Cancel"
      )
</template>

<script>
import { DeploymentParamMixin } from '@/mixins'
import { SplashMessageBus } from '@/busses'
import { MUTATIONS } from '@/constants'

import BackButtonBlock from '@/components/block/BackButtonBlock'
import ThirdWidth from '@/components/layout/ThirdWidth'
import ErrorMessage from '@/components/layout/ErrorMessage'
import ChallengeForm from '@/components/form/ChallengeForm'

export default {
  components: { BackButtonBlock, ThirdWidth, ErrorMessage, ChallengeForm },
  mixins: [ DeploymentParamMixin ],
  data () {
    return {
      challenge: this.genChallenge(),
      inProgress: false,
      errors: []
    }
  },
  methods: {
    genChallenge () {
      return {
        name: '',
        metric: '',
        mode: '',
        target: null,
        start: null,
        end: null,
        deletedAt: null
      }
    },
    async submit (challenge) {
      // Setup the lock and update our challenge
      this.errors = []
      this.inProgress = true
      Object.assign(this.challenge, challenge)
      
      // Perform the request
      let { meta, data } = await this.$api.createChallenge(
        this.deploymentId, challenge
      )
      
      // Store any errors
      this.errors = meta.messages
      
      if (meta.success) {
        // Tell the user
        SplashMessageBus.$emit('message', {
          body: `${challenge.name} was created`,
          type: 'success'
        })
        
        // Store the challenge
        this.$store.commit(MUTATIONS.CHALLENGES, [ data ])
        
        // Navigate back
        this.$router.push(this.deploymentChallengesRoute)
      } else if (this.errors.length === 0) {
        // Add a default error if there isn't any messages
        this.errors.push('Could not create challenge, please try again')
      }
      
      // Release the lock
      this.inProgress = false
    },
    async cancel () {
      this.$router.push(this.deploymentChallengesRoute)
    }
  }
}
</script>

<style lang="sass">
</style>
