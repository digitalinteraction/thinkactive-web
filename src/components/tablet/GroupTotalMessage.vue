<template lang="pug">
.group-message.total.has-text-centered
  p.top Compete against other groups to walk the most steps
  p.group(v-for="group, i in sortedGroups")
    span {{ i + 1 }}. {{ group.name | capitalize }}
    span {{ group.steps | number }}
      span.unit  steps
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
    groups () {
      return this.groupStepData(this.stepData)
    },
    sortedGroups () {
      return this.sortedGroupStepData(this.groups)
    }
  }
}
</script>

<style lang="sass">
.group-message.total
</style>
