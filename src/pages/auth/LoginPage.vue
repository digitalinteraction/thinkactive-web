<template lang="pug">
.login-page
  hero.is-primary
    .container
      h1.title Log in
      h2.subtitle Sign in to ThinkActive to access your dashboard
  section.section
    half-width
      error-message(title="Login Failed", v-model="messages")
      login-form(@submit="submit", :disabled="disabled")
  section.section
    half-width.has-text-right
      hr
      router-link.button.is-text(:to="{name: 'ForgottenPassword'}")
        | forgot your password?
</template>

<script>
import { ROUTES } from '@/constants'
import { AuthMixin } from '@/mixins'

import ErrorMessage from '@/components/layout/ErrorMessage'
import Hero from '@/components/layout/Hero'
import HalfWidth from '@/components/layout/HalfWidth'
import NavControl from '@/components/layout/NavControl'
import LoginForm from '@/components/form/LoginForm'

export default {
  components: { ErrorMessage, Hero, HalfWidth, NavControl, LoginForm },
  mixins: [ AuthMixin ],
  data () {
    return { messages: [] }
  },
  computed: {
    disabled () { return this.checkingLogin || this.loggingIn }
  },
  mounted () {
    if (this.$store.state.user) {
      return this.$router.replace({ name: ROUTES.DASH_HOME })
    }
    this.checkLogin({ name: ROUTES.DASH_HOME })
  },
  methods: {
    async submit (email, password) {
      let success = await this.performLogin(email, password)
      this.messages = success
        ? []
        : [ 'Please check your login and try again' ]
    }
  }
}
</script>

<style>
</style>
