<template lang="pug">
.login-form
  .field
    label.label Email
    .control.has-icons-left
      input.input(type="text", v-model="email", placeholder="me@example.com", autocapitalize="off")
      .icon.is-left
        fa(:icon="['far', 'envelope']")
  .field
    label.label Password
    .control.has-icons-left
      input.input(type="password", v-model="password", placeholder="••••••••", @keyup.enter="submit", autocapitalize="off", autocorrect="off")
      .icon.is-left
        fa(icon="lock")
  .field.is-grouped.is-grouped-centered
    .control
      router-link.button.is-text(:to="returnTo") Cancel
    .control
      button.button.is-success(@click="submit", :disabled="!canSubmit") Log In
</template>

<script>

/* Events:

@submit () -> When the user submits the form

*/

import { ROUTES } from '@/constants'

export default {
  props: {
    disabled: { type: Boolean, default: false },
    returnTo: {
      type: Object,
      default () { return { name: ROUTES.HOME } }
    }
  },
  data () {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    canSubmit () {
      return !this.disabled && this.email !== '' && this.password !== ''
    }
  },
  methods: {
    submit () {
      this.$emit('submit', this.email, this.password)
    }
  }
}
</script>

<style lang="css">
</style>
