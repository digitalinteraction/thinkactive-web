<template lang="pug">
.forgotten-password-form
  label.label New Password
  .field.is-grouped
    .control.has-icons-left.is-expanded
      input.input(type="password", v-model="password", placeholder="••••••••", @keyup.enter="submit")
      .icon.is-left
        fa(icon="lock")
    .control
      button.button.is-success(@click="submit", :disabled="!canSubmit") Reset Password
</template>

<script>

/* Events:

@submit () -> When the user submits the form

*/

export default {
  data () {
    return { password: '' }
  },
  computed: {
    canSubmit () {
      return !this.disabled && this.password !== ''
    }
  },
  methods: {
    submit () {
      this.$emit('submit', this.password)
    }
  }
}
</script>

<style lang="css">
</style>
