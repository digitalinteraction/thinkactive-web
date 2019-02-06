<template lang="pug">
.forgotten-password-form
  label.label Email
  .field.is-grouped
    .control.has-icons-left.is-expanded
      input.input(type="text", v-model="email", placeholder="me@example.com", @keyup.enter="submit")
      .icon.is-left
        fa(:icon="['far', 'envelope']")
    .control
      button.button.is-primary(@click="submit", :disabled="!canSubmit") Send Code
</template>

<script>

/* Events:

@submit () -> When the user submits the form

*/

export default {
  props: {
    disabled: { type: Boolean, required: true }
  },
  data () {
    return { email: '' }
  },
  computed: {
    canSubmit () { return !this.disabled && this.email !== '' }
  },
  methods: {
    submit () {
      if (!this.canSubmit) return
      this.$emit('submit', this.email)
    }
  }
}
</script>

<style lang="css">
</style>
