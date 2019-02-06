<template lang="pug">
.group-message.average.has-text-centered
  p.top Compete against other groups to get the most steps per day
  p.group(v-for="group, i in sortedGroups")
    span {{ i + 1 }}. {{ group.name | capitalize }}
    span {{ group.steps | number }}
      span.unit  per day
</template>

<script>
import { ChallengeMessageMixin } from '@/mixins'

export default {
  mixins: [ ChallengeMessageMixin ],
  props: {
    challenge: { type: Object, required: true }
  },
  computed: {
    groups () {
      let groups = this.groupStepData(this.stepData)
      
      let duration = this.challengeDuration(this.challenge)
      Object.keys(groups).forEach(name => {
        groups[name] = Math.round(groups[name] / duration)
      })
      
      return groups
    },
    sortedGroups () {
      return this.sortedGroupStepData(this.groups)
    }
  }
}
</script>

<style lang="sass">
</style>
