<template lang="pug">
.deployment-info-form
  .columns
    .column.is-third
      control(label="Name", left-icon="tag")
        input.input(type="text", v-model="info.name", placeholder="New Deployment", required)
    .column.is-third
      control(label="Location", left-icon="location-arrow")
        input.input(type="text", v-model="info.location", placeholder="North Newcastle", required)
    .column.is-third
      control(label="Point of Contact", left-icon="user")
        input.input(type="text", v-model="info.pointOfContact", placeholder="Joe Blogs", required)
  
  h3 Baseline Measurement
  .columns
    .column.is-third
      control(label="From", :left-icon="['far', 'calendar']")
        date-picker(v-model="info.baselineFrom", name="baselineFrom", input-class="input", placeholder="Starting from", required)
    .column.is-third
      control(label="To", :left-icon="['far', 'calendar']")
        date-picker(v-model="info.baselineTo", name="baselineTo", input-class="input", placeholder="Running to", required)
    .column.is-third()
  
  h3 Activity Measurement
  .columns
    .column.is-third
      control(label="From", :left-icon="['far', 'calendar']")
        date-picker(v-model="info.activityFrom", name="activityFrom", input-class="input", placeholder="Starting from", required)
    .column.is-third
      control(label="To", :left-icon="['far', 'calendar']")
        date-picker(v-model="info.activityTo", name="activityTo", input-class="input", placeholder="Running to", required)
    .column.is-third
  
  hr
  
  .buttons.is-centered
    button.button.is-text(v-if="cancelButton", @click="cancel") {{cancelButton}}
    button.button.is-primary(v-if="submitButton", @click="submit", :disabled="!canSubmit") {{submitButton}}
</template>

<script>

/* Events:

@submit (info) -> When the user submits the form
@camcel ()     -> When the user cancels the submission

*/

import Control from '@/components/layout/Control'
import DatePicker from 'vuejs-datepicker'

export default {
  components: { Control, DatePicker },
  props: {
    initial: { type: Object, required: true },
    cancelButton: { type: String, default: null },
    submitButton: { type: String, default: null }
  },
  data () {
    return {
      info: Object.assign({}, this.initial)
    }
  },
  computed: {
    canSubmit () {
      return this.info.name !== '' &&
        this.info.location !== '' &&
        this.info.pointOfContact !== '' &&
        this.info.baselineFrom !== null &&
        this.info.baselineTo !== null &&
        this.info.activityFrom !== null &&
        this.info.activityTo !== null
    }
  },
  methods: {
    submit () {
      this.$emit('submit', Object.assign({}, this.info))
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="css">
</style>
