<template lang="pug">
.join-org-form
  error-message(v-model="messages")
  
  .columns
    .column.is-half
      control(label="First Name", left-icon="info")
        input.input(type="text", v-model="firstName", placeholder="Rodger")
    .column.is-half
      control(label="Surname", left-icon="info")
        input.input(type="text", v-model="lastName", placeholder="Williams")
  
  password-control(v-model="password", @strength="s => strength = s")
  
  .buttons.is-centered
    button.button.is-success(@click="submit", :disabled="!canSubmit")
      .icon
        fa(icon="check")
      span Sign up
</template>

<script>
import { AuthMixin } from '@/mixins'

import ErrorMessage from '@/components/layout/ErrorMessage'
import PasswordControl from '@/components/layout/PasswordControl'
import Control from '@/components/layout/Control'

export default {
  components: { ErrorMessage, PasswordControl, Control },
  mixins: [ AuthMixin ],
  data () {
    return {
      firstName: '',
      lastName: '',
      password: '',
      strength: 0,
      messages: []
    }
  },
  computed: {
    canSubmit () {
      return this.firstName !== '' &&
        this.lastName !== '' &&
        this.password !== '' &&
        this.strength >= 2
    }
  },
  methods: {
    async submit () {
      this.messages = []
      
      let { meta, data } = await this.$api.acceptOrgInvite(
        this.$route.params.code, this.firstName, this.lastName, this.password
      )
      if (meta.success) {
        this.commitLogin(data)
      } else {
        this.messages = meta.messages.length > 0
          ? this.messages
          : [ 'Something went wrong, please check your join code and try again' ]
      }
    }
  }
}
</script>

<style lang="css">
</style>
