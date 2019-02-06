<template lang="pug">
.collab-total-message.has-text-centered
  p.pre-target We have walked
  counter.target(:to="totalSteps")
  p.post-target steps in the last seven days
</template>

<script>
import Counter from '@/components/layout/Counter'

export default {
  components: { Counter },
  props: {
    stepData: { type: Object, required: true }
  },
  computed: {
    totalSteps () {
      let total = 0

      for (let id in this.stepData) {
        for (let epoch in this.stepData[id]) {
          total += this.stepData[id][epoch]
        }
      }

      return total
    }
  }
}
</script>

<style lang="sass">
.collab-total-message
  .pre-target
    font-size: 0.8em
  .target
    font-size: 2.3em
  .post-target
    font-size: 0.8em
  .description
    font-size: 1em
    margin-top: 1em
</style>
