<template lang="pug">
.data-export-form
  .columns
    .column
      control(label="Starts", :left-icon="['far', 'calendar']")
        date-picker(v-model="challenge.start", name="start", input-class="input", placeholder="Starting from", :disabled="disabledDates", required)
    .column
      control(label="Ends", :left-icon="['far', 'calendar']")
        date-picker(v-model="challenge.end", name="end", input-class="input", placeholder="Running to", :disabled="disabledDates", required)
  hr

  .buttons.is-centered
    button.button.is-text(v-if="cancelAction", @click="cancel") {{cancelAction}}
    button.button.is-primary(v-if="submitAction", @click="submit", :disabled="!canSubmit") {{submitAction}}
</template>

<script>

/* Events:

@submit (challenge) -> When the user submits the form
@cancel () ->          When the user cancels the submission

*/

import Control from '@/components/layout/Control'
import DatePicker from 'vuejs-datepicker'

export default {
  components: { Control, DatePicker },
  props: {
    initial: { type: Object, required: true },
    isNew: { type: Boolean, default: false },
    cancelAction: { type: String, default: null },
    submitAction: { type: String, default: null },
    disabled: { type: Boolean, default: false }
  },
  data () {
    return {
      challenge: { ...this.initial }
    }
  },
  computed: {
    canSubmit () {
      return !!(!this.disabled &&
        this.challenge.name &&
        this.challenge.metric &&
        this.challenge.mode &&
        typeof this.challenge.target === 'number' &&
        this.challenge.target > 0 &&
        this.challenge.start &&
        this.challenge.end)
    },
    disabledDates () {
      if (!this.isNew) return {}

      let now = new Date()
      now.setHours(0, 0, 0, 0)
      return { to: now }
    }
  },
  methods: {
    submit () {
      this.$emit('submit', { ...this.challenge })
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="sass">
</style>
