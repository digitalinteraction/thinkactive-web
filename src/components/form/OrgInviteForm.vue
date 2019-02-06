<template lang="pug">
.org-invite-form
  //- .columns
    .column
      control(label="First name", left-icon="tag")
        input.input(type="text", v-model="firstName", placeholder="Dwayne", required)
    .column
      control(label="Surname", left-icon="tag")
        input.input(type="text", v-model="lastName", placeholder="Johnson", required)
  .columns
    .column
      control(label="Email", left-icon="at")
        input.input(type="text", v-model="email", placeholder="therock@gmail.com", @keyup.enter="submit", required)
  .buttons.is-centered
    button.button.is-text(@click="cancel") Cancel
    button.button.is-primary.is-medium(
      @click="submit", :disabled="!canSubmit"
    )
      span.icon: fa(icon="user-plus")
      span Invite {{ firstName }}
</template>

<script>

/* Events:
@submit (firstName, lastName, email) -> When the user invites a member
@cancel ()                           -> When the user cancels the form
*/

import Control from '@/components/layout/Control'

export default {
  components: { Control },
  props: {
    disabled: { type: Boolean, default: false }
  },
  data: () => ({
    firstName: '',
    lastName: '',
    email: ''
  }),
  computed: {
    canSubmit () {
      return !this.disabled &&
        // this.firstName &&
        // this.lastName &&
        this.email
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    submit () {
      this.$emit('submit', {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email
      })
    }
  }
}
</script>

<style lang="css">
</style>
