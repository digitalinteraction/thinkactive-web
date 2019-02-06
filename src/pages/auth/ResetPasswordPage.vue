<template lang="pug">
.forgotten-password-page
  hero.is-primary
    .container
      h1.title Reset Password
      h2.subtitle Use this form to reset you password
  section.section
    half-width
      error-message(v-model="messages")
      reset-password-form(@submit="submit", :disabled="!isResetting")
</template>

<script>
import { ROUTES } from '@/constants'
import { AuthMixin } from '@/mixins'
import Hero from '@/components/layout/Hero'
import ErrorMessage from '@/components/layout/ErrorMessage'
import HalfWidth from '@/components/layout/HalfWidth'
import ResetPasswordForm from '@/components/form/ResetPasswordForm'

export default {
  components: { Hero, HalfWidth, ErrorMessage, ResetPasswordForm },
  mixins: [ AuthMixin ],
  data () {
    return { isResetting: false, messages: [] }
  },
  methods: {
    async submit (password) {
      this.isResetting = true
      let token = this.$route.params.code
      let { meta } = await this.$api.resetPassword(token, password)
      this.isResetting = false
      
      if (meta.success) {
        this.messages = []
        this.$router.push({ name: ROUTES.LOGIN })
      } else {
        this.messages = [ 'Something went wrong, please try again' ]
      }
    }
  }
}
</script>

<style>
</style>
