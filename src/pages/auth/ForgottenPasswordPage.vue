<template lang="pug">
.forgotten-password-page
  section.hero.is-primary
    .hero-body
      .container
        h1.title Forgotten Password
        h2.subtitle Use this form if you have forgotten your password and need to reset it
  section.section
    half-width
      error-message(v-model="messages")
      template(v-if="sentToken")
        h1.title Reset Token Sent
        p If that email exists we have sent it a reset token which you can use to reset your password.
      template(v-else)
        forgotten-password-form(@submit="submit", :disabled="isSubmitting")
      hr
      .field.is-grouped
        nav-control(modifiers="is-link", :to="returnLink", icon="chevron-left")
          | Go Back
        button-control(v-if="sentToken", modifiers="is-info", @click="sentToken = false", icon="sync")
          | Try Again
</template>

<script>
import { ROUTES } from '@/constants'
import HalfWidth from '@/components/layout/HalfWidth'
import ButtonControl from '@/components/layout/ButtonControl'
import ErrorMessage from '@/components/layout/ErrorMessage'
import NavControl from '@/components/layout/NavControl'
import ForgottenPasswordForm from '@/components/form/ForgottenPasswordForm'

export default {
  components: { HalfWidth, ButtonControl, NavControl, ForgottenPasswordForm, ErrorMessage },
  data () {
    return {
      isSubmitting: false,
      sentToken: false,
      messages: []
    }
  },
  computed: {
    returnLink () {
      return { name: ROUTES.LOGIN }
    }
  },
  methods: {
    async submit (email) {
      this.isSubmitting = true
      let { meta } = await this.$api.forgotPassword(email)
      this.messages = meta.success ? [] : [ 'Something went wrong, please try again' ]
      this.isSubmitting = false
      this.sentToken = meta.success
    }
  }
}
</script>

<style>
</style>
