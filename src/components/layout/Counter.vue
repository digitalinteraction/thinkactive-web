<template lang="pug">
span.count-up
  template(v-if="to === null || to === undefined") ~
  template(v-else) {{ current | number }}
</template>

<script>
import ease from 'eases/quint-out'

const FRAME_RATE = 40

export default {
  props: {
    to: { type: Number, default: null },
    duration: { type: Number, default: 5000 }
  },
  data () {
    return {
      current: 0,
      timer: null,
      start: null,
      step: null
    }
  },
  watch: {
    to (newValue) {
      this.begin()
    }
  },
  mounted () {
    if (this.to !== undefined || this.to !== undefined) {
      this.begin()
    }
  },
  destroyed () {
    this.end()
  },
  methods: {
    begin () {
      this.step = 0
      this.start = this.current
      if (!this.timer) {
        this.timer = setInterval(() => this.tick(), FRAME_RATE)
      }
    },
    end () {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
    },
    tick () {
      this.step += FRAME_RATE
      let factor = Math.min(1.0, this.step / this.duration)
      this.current = this.start + Math.ceil(ease(factor) * this.to - this.start)
      
      if (factor >= 1) this.end()
    }
  }
}
</script>

<style lang="sass">
.count-up
  // font-family: $family-monospace
</style>
