<template lang="pug">
.password-control.field
  label.label {{label}}
  .control.has-icons-left
    input.input(
      type="password",
      :value="value",
      @input="input",
      placeholder="••••••••"
    )
    .icon.is-left
      fa(icon="lock")
  p.help(v-if="strength")
    span.tags.is-marginless
      span.tag.is-danger(v-if="warning") {{warning}}
      span.tag.is-warning(v-for="msg in suggestions") {{msg}}
    progress.progress.is-small(v-if="strength", :value="strength.score", max="4", :class="strengthClass")
</template>

<script>
const zxcvbn = require('zxcvbn')

/* Events:

@input    (password) -> When the users is typing their passowrd (for v-model)
@strength (strength) -> When the strength of the password changes

*/

export default {
  props: {
    value: { type: String, required: true },
    label: { type: String, default: 'Password' }
  },
  data () {
    return {
      strength: null
    }
  },
  computed: {
    strengthClass () {
      if (!this.strength) return ''
      if (this.strength.score < 1) return 'is-danger'
      if (this.strength.score < 3) return 'is-warning'
      return 'is-success'
    },
    warning () {
      return this.strength &&
        this.strength.feedback &&
        this.strength.feedback.warning
    },
    suggestions () {
      return this.strength &&
        this.strength.feedback &&
        this.strength.feedback.suggestions
    }
  },
  watch: {
    value (newValue) {
      this.process(newValue)
    }
  },
  mounted () {
    this.process(this.value)
  },
  methods: {
    input (e) {
      this.$emit('input', e.target.value)
    },
    process (value) {
      this.strength = value !== '' ? zxcvbn(this.value) : null
      this.$emit('strength', this.strength && this.strength.score)
    }
  }
}
</script>

<style lang="css">
</style>
