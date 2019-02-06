<template lang="pug">
table.deployments.table.is-hoverable.is-fullwidth.is-size-5
  thead
    tr
      th ID
      th Name
      th Location
      th Contact
      th Baseline
      th Activity
      th.is-narrow
  tbody
    tr.is-clickable(
      v-for="deployment in deployments",
      @click="$emit('choose', deployment)"
    )
      td {{deployment.id}}
      td {{deployment.name}}
      td {{deployment.location}}
      td {{deployment.pointOfContact}}
      td {{[deployment.baselineFrom, deployment.baselineTo] | dateRange}}
      td {{[deployment.activityFrom, deployment.activityTo] | dateRange}}
      td.has-text-grey-light
        fa(icon="chevron-right")
</template>

<script>

/* Events:

@choose (deployment) -> When a deployment row was clicked

 */

export default {
  props: {
    deployments: { type: Array, required: true }
  }
}
</script>

<style lang="css">
</style>
