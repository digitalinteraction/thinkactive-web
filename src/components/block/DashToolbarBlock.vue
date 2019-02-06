<template lang="pug">
.level
  .level-left
    .level-item
      .field.has-addons
        p.control
          input.input(
            type="text",
            :value="query",
            @input="updateQuery",
            placeholder="Filter"
          )
        p.control
          button.button.is-static
            fa(icon="search")
  .level-right
    .level-item
      router-link.button.is-link(:to="inviteRoute")
        span.icon
          fa(icon="user-plus")
        span Invite Member
    .level-item
      router-link.button.is-success(:to="createRoute")
        span.icon
          fa(icon="plus")
        span New Deployment
</template>

<script>

/* Events:

@update:query () -> When the query string changes (formatted for v-bind.sync)

*/

import { ROUTES } from '@/constants'

export default {
  props: {
    query: { type: String, required: true }
  },
  computed: {
    createRoute () {
      return { name: ROUTES.NEW_DEPLOYMENT }
    },
    inviteRoute () {
      return { name: ROUTES.ORG_INVITE }
    }
  },
  methods: {
    updateQuery (e, v) {
      this.$emit('update:query', e.target.value)
    }
  }
}
</script>

<style lang="css">
</style>
