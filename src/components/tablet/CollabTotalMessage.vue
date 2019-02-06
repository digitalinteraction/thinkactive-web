<template lang="pug">
.collab-message.total.has-text-centered
  template(v-if="completedChallenge")
    p.top.success Challenge completed!
    p.pre-target We have walked
    p.target: counter(:to="totalSteps", :duration="2000")
    p.post-target steps
    p.bottom We had to walk {{ challenge.target | number }} steps
    
  template(v-else)
    p.top Work together to walk {{ challenge.target | number }} steps
    p.pre-target We have walked
    counter.target(:to="totalSteps", :duration="2000")
    p.post-target steps so far
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
    totalSteps () { return this.countAllSteps(this.stepData) },
    completedChallenge () {
      return this.totalSteps >= this.challenge.target
    }
  }
}
</script>

<style lang="sass">
</style>
