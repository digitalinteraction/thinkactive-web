<template lang="pug">
.deployment-edit-challenge-page
  back-button-block(:to="deploymentChallengesRoute")
  section.section(v-if="isLoading")
    third-width
      h2.title Loading
      loading(title="Fetching Challenge")
  section.section(v-if="!challenge")
    third-width
      h2.title Not found
      h3.subtitle That challenge could not be found or does not exist
  section.section(v-else)
    third-width
      h2.title Editing {{challenge.name}}
      h3.subtitle Use this form to reconfigure this challenge
      challenge-form(
        :initial="challenge",
        :disabled="inProgress",
        @submit="submit",
        @cancel="cancel",
        submit-action="Update",
        cancel-action="Cancel"
      )
</template>

<script>
import { DeploymentParamMixin } from '@/mixins'
import { SplashMessageBus } from '@/busses'
import { MUTATIONS } from '@/constants'

import BackButtonBlock from '@/components/block/BackButtonBlock'
import ThirdWidth from '@/components/layout/ThirdWidth'
import Loading from '@/components/layout/Loading'
import ChallengeForm from '@/components/form/ChallengeForm'

export default {
  components: { BackButtonBlock, ThirdWidth, Loading, ChallengeForm },
  mixins: [ DeploymentParamMixin ],
  data: () => ({
    isLoading: false,
    inProgress: false,
    errors: []
  }),
  computed: {
    challengeId () {
      return parseInt(this.$route.params.challenge_id)
    },
    challenge () {
      return this.$store.getters.deploymentChallengeById(this.challengeId)
    }
  },
  mounted () {
    if (!this.challenge) {
      this.fetchChallenges()
    }
  },
  methods: {
    async fetchChallenges () {
      this.isLoading = true
      let { data } = await this.$api.getChallenges(this.deploymentId)
      this.$store.commit(MUTATIONS.CHALLENGES, data || [])
      this.isLoading = false
    },
    async submit (updatedChallenge) {
      // Setup the lock
      this.errors = []
      this.inProgress = true
      
      // Attempt to update the challenge
      let { meta, data } = await this.$api.editChallenge(
        this.challengeId, updatedChallenge
      )
      
      // Store any errors
      this.errors = meta.messages
      
      if (meta.success) {
        // Tell the user
        SplashMessageBus.$emit('message', {
          body: `${updatedChallenge.name} was updated`,
          type: 'success'
        })
        
        // Store the new challenge
        this.$store.commit(MUTATIONS.CHALLENGES, [ data ])
        
        // Navigate back
        this.$router.push(this.deploymentChallengesRoute)
      } else if (this.errors.length === 0) {
        // Add a default error
        this.errors.push('Could not update that challange, please try again')
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
