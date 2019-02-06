<template lang="pug">
.dash-home-page
  hero.is-primary
    .container
      h1.title Hey,
      h2.subtitle Here are your ThinkActive organisations
  section.section
    .container
      .columns
        .column
          h1.title.is-4.has-text-centered Your Organisations
          api-block(
            :endpoint="fetchOrgs",
            v-model="orgs",
            loading="Fetching Your Organisations"
          )
          template(v-if="orgs")
            organisations-table(
              :orgs="orgs",
              @choose="chooseOrg"
            )
            //- .buttons.is-centered
              router-link.button.is-success(:to="newOrgRoute")
                .icon
                  fa(icon="plus", size="sm")
                span Create Organisation
        .column
          h1.title.is-4.has-text-centered Your Account
          .field
            label.label.is-marginless Name
            //- p.is-size-5.has-text-grey {{ user.firstName }} {{ user.lastName }}
            p.is-size-5.has-text-grey {{ user.username }}
          .field
            label.label.is-marginless Email
            p.is-size-5.has-text-grey {{ user.email }}
          .buttons.is-centered
            button.button.is-danger(@click="logout")
              span.icon: fa(icon="power-off")
              span Log out
</template>

<script>
import { ROUTES } from '@/constants'
import { AuthMixin } from '@/mixins'

import Hero from '@/components/layout/Hero'
import ApiBlock from '@/components/layout/ApiBlock'
import OrganisationsTable from '@/components/table/OrganisationsTable'

export default {
  components: { Hero, ApiBlock, OrganisationsTable },
  mixins: [ AuthMixin ],
  data () {
    return { orgs: null }
  },
  computed: {
    newOrgRoute () {
      return { name: ROUTES.NEW_ORG }
    },
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    fetchOrgs () {
      return this.$api.listOrgs()
    },
    chooseOrg (org) {
      const params = { org_id: org.id }
      this.$router.push({ name: ROUTES.ORG_HOME, params })
    },
    async logout () {
      let confirmed = confirm('Are you sure you want to logout?')
      if (!confirmed) return
      await this.performLogout()
    }
  }
}
</script>

<style lang="css">
</style>
