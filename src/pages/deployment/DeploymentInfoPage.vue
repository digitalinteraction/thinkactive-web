<template lang="pug">
section.section.deploy-info-page
  .container
    h1.title Information
    h2.subtitle The details about this deployment
    
    .columns
      .column.is-third
        p.is-size-6.has-text-grey Name
        p.is-size-4 {{deployment.name}}
      .column.is-third
        p.is-size-6.has-text-grey Location
        p.is-size-4 {{deployment.location}}
      .column.is-third
        p.is-size-6.has-text-grey Point of Contact
        p.is-size-4 {{deployment.pointOfContact}}
    
    hr
    
    .columns
      .column.is-half
        p.is-size-6.has-text-grey Baseline Period
        p.is-size-4
          | {{formatDate(deployment.baselineFrom)}}
          |
          fa(icon="arrow-right", size="sm")
          |
          | {{formatDate(deployment.baselineTo)}}
      .column.is-half
        p.is-size-6.has-text-grey Activity Period
        p.is-size-4
          | {{formatDate(deployment.activityFrom)}}
          |
          fa(icon="arrow-right", size="sm")
          |
          | {{formatDate(deployment.activityTo)}}
</template>

<script>
import moment from 'moment-mini'
import { OrgParamMixin, DeploymentParamMixin } from '@/mixins'

export default {
  mixins: [ OrgParamMixin, DeploymentParamMixin ],
  methods: {
    formatDate (date) {
      return moment(date).format('Do MMM YY')
    }
  }
}
</script>

<style lang="css">
</style>
