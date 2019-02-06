<template lang="pug">
section.section.deployment-challenge-page
  .container
    .level
      .level-left
        .level-item
          div
            h1.title Challenges
            p.is-size-5
              | This deployment has {{challengeCount}} challenges
              a.is-size-7.is-unselectable(@click.prevent="refresh")  (refresh)
      .level-right
        .level-item
          router-link.button.is-success(:to="createRoute")
            span.icon: fa(icon="plus")
            span New Challenge
    loading(
      v-if="inProgress",
      title="Fetching Challenges"
    )
    template(v-else-if="challenges.length > 0")
      h3.subtitle.is-marginless Upcoming Challenges
      challenges-table(:challenges="upcomingChallenges", :deployment="deployment")
      
      hr.is-medium
      
      h3.subtitle.is-marginless Active Challenges
      challenges-table(:challenges="activeChallenges", :deployment="deployment")
      
      hr.is-medium
      
      h3.subtitle.is-marginless Past Challenges
      challenges-table(:challenges="pastChallenges", :deployment="deployment")
    section.section.is-size-5.has-text-centered.has-text-grey(v-else)
      p There aren't any challenges on this deployment, why not add one?
</template>

<script>
import { ROUTES, MUTATIONS } from '@/constants'
import { OrgParamMixin, DeploymentParamMixin, DatesMixin } from '@/mixins'

import Hero from '@/components/layout/Hero'
import Loading from '@/components/layout/Loading'
import ChallengesTable from '@/components/table/ChallengesTable'

export default {
  components: { Hero, Loading, ChallengesTable },
  mixins: [ OrgParamMixin, DeploymentParamMixin, DatesMixin ],
  data: () => ({
    inProgress: false
  }),
  computed: {
    challenges () {
      return this.$store.getters.deploymentChallenges(this.deploymentId)
    },
    challengeCount () {
      return this.challenges.length || '~'
    },
    activeChallenges () {
      let now = new Date()
      return this.challenges.filter(c =>
        now > this.startOfDay(c.start) && now < this.endOfDay(c.end)
      )
    },
    upcomingChallenges () {
      let now = new Date()
      return this.challenges.filter(c => this.startOfDay(c.start) > now)
    },
    pastChallenges () {
      let now = new Date()
      return this.challenges.filter(c => this.endOfDay(c.end) < now)
    },
    createRoute () {
      return { name: ROUTES.DEPLOYMENT_NEW_CHALLENGE }
    }
  },
  mounted () {
    if (this.challenges.length === 0) {
      this.fetchChallenges()
    }
  },
  methods: {
    async fetchChallenges () {
      this.inProgress = true
      let { meta, data } = await this.$api.getChallenges(this.deploymentId)
      if (meta.success) {
        this.$store.commit(MUTATIONS.CHALLENGES, data)
      }
      this.inProgress = false
      return { meta, data }
    },
    refresh () {
      this.fetchChallenges()
    }
  }
}
</script>

<style lang="sass">
.deployment-challenge-page
</style>
