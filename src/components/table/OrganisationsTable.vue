<template lang="pug">
table.table.is-hoverable.is-fullwidth.is-size-5
  thead
    tr
      th {{ title }}
      th.is-narrow
  tbody
    tr.is-clickable(v-for="org in orgs", @click="$emit('choose', org)")
      td {{org.name}}
      td.has-text-grey-light
        fa(icon="chevron-right")
</template>

<script>

/* Events:

@choose (org) -> When an organisation was clicked

*/

export default {
  props: {
    orgs: { type: Array, required: true },
    title: { type: String, default: 'Organisation Name' }
  }
}
</script>

<style lang="css">
</style>
