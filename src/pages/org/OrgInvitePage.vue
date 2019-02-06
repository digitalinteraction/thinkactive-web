<template lang="pug">
.org-invite-page
  hero.is-primary
    .container
      h1.title Invite Member
      h2.subtitle Use this form to invite someone to your organisation, they will have full access to all the organisation's deployments
  back-button-block(:to="orgRoute")
  section.section
    half-width
      h1.title Organisation invitation
      error-message(v-model="errors")
      org-invite-form(
        @submit="inviteMember",
        @cancel="navigateBack"
        :disabled="inProgress"
      )
</template>

<script>
import { ROUTES } from '@/constants'

import { OrgParamMixin } from '@/mixins'
import { SplashMessageBus } from '@/busses'

import Hero from '@/components/layout/Hero'
import ErrorMessage from '@/components/layout/ErrorMessage'
import HalfWidth from '@/components/layout/HalfWidth'
import BackButtonBlock from '@/components/block/BackButtonBlock'
import OrgInviteForm from '@/components/form/OrgInviteForm'

export default {
  components: { Hero, ErrorMessage, HalfWidth, BackButtonBlock, OrgInviteForm },
  mixins: [ OrgParamMixin ],
  data: () => ({
    inProgress: false,
    errors: []
  }),
  computed: {
    orgRoute () {
      return { name: ROUTES.ORG_HOME }
    }
  },
  methods: {
    async inviteMember (member) {
      if (this.inProgress) return
      this.inProgress = true
      this.errors = []
      
      let { meta } = await this.$api.inviteToOrg(
        this.orgId, '', '', member.email
      )
      
      this.errors = meta.messages
      
      if (meta.success) {
        SplashMessageBus.$emit('message', {
          body: `${member.email} was invited to ${this.organisation.name}`,
          type: 'success'
        })
        this.navigateBack()
      } else if (this.errors.length === 0) {
        this.errors.push('Could not invite member, please try again')
      }
      
      this.inProgress = false
    },
    navigateBack () {
      this.$router.push(this.orgRoute)
    }
  }
}
</script>

<style lang="sass">
</style>
