<template lang="pug">
.loading.section.is-light.has-text-centered(:class="size", v-if="canShow")
  h1.title {{title}}
  fa.is-light(icon="circle-notch", spin, size="4x")
</template>

<script>
import { TimersMixin } from '@/mixins'

export default {
  mixins: [ TimersMixin ],
  props: {
    title: { type: String, default: 'Fetching Info' },
    size: { type: String, default: 'medium' },
    debounce: { type: Number, default: 300 }
  },
  timeouts () {
    return { showSelf: this.debounce }
  },
  data: () => ({
    canShow: false
  }),
  computed: {
    sizeClass () { return `is-${this.size}` }
  },
  methods: {
    showSelf () { this.canShow = true }
  }
}
</script>

<style lang="css">
</style>
