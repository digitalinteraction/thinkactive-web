<template lang="pug">
.collab-message.average.has-text-centered
  template(v-if="completedChallenge")
    p.top.success Challenge completed!
    p.pre-target We have walked
    p.target: counter(:to="averageSteps", :duration="2000")
    p.post-target steps per day
    p.bottom Each day we walked at least {{ challenge.target | number }} steps
    
  template(v-else)
    p.top Work together to walk {{ challenge.target | number }} steps each day
    p.pre-target We have walked
    p.target: counter(:to="averageSteps", :duration="2000")
    p.post-target steps per day so far
    p.bottom &nbsp;
</template>

<script>
import Counter from '@/components/layout/Counter'
import { ChallengeMessageMixin } from '@/mixins'

export default {
  components: { Counter },
  mixins: [ ChallengeMessageMixin ],
  props: {
    challenge: { type: Object, required: true }
  },
  computed: {
    averageSteps () {
      return this.countAllSteps(this.stepData) / this.challengeDuration(this.challenge)
    },
    completedChallenge () {
      return this.averageSteps >= this.challenge.target
    }
  }
}
</script>

<style lang="sass">
</style>
