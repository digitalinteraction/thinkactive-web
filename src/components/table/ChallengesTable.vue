<template lang="pug">
table.table.challenges.is-hoverable.is-fullwidth.is-size-5
  thead
    tr
      th ID
      th Name
      th When
      th Metric
      th Mode
      th Target
      th.has-text-right Actions
  tbody
    tr(v-if="challenges.length === 0")
      td(colspan="7").has-text-grey-light.has-text-centered
        | No challenges to show
    tr(
      v-for="challenge in challenges",
      @click="$emit('choose', challenge)"
    )
      td {{challenge.id}}
      td {{challenge.name}}
      td {{[challenge.start, challenge.end] | dateRange}}
      td {{challenge.metric | capitalize}}
      td {{challenge.mode | capitalize}}
      td {{challenge.target | number}}
      td
        .buttons.is-right(v-if="canChange(challenge)")
          router-link.button.is-info(:to="challengeRoute(challenge)")
            .icon: fa(icon="edit")
          //- button.button.is-danger(@click="$emit('delete', challenge)")
            .icon: fa(icon="trash-alt")
        span(v-else) ~
</template>

<script>

/* Events

@choose (challenge) -> When a challenge row was clicked
@delete (challenge) -> When the user wants to delete a challenge

*/

import { ROUTES } from '@/constants'

export default {
  props: {
    challenges: { type: Array, required: true },
    deployment: { type: Object, required: true }
  },
  methods: {
    canChange (challenge) {
      return true
      // return (new Date(challenge.end) > new Date() &&
      //   new Date(challenge.start) < new Date())
    },
    challengeRoute (challenge) {
      return {
        name: ROUTES.DEPLOYMENT_EDIT_CHALLENGE,
        params: {
          org_id: this.deployment.organisationId,
          deployment_id: this.deployment.id,
          challenge_id: challenge.id
        }
      }
    }
  }
}
</script>

<style lang="sass">
</style>
