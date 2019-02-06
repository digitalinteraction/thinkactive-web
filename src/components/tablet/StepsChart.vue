<template lang="pug">
.steps-chart.is-glossed
  .bars(v-if="userData")
    .bar(v-for="data in formattedData", :style="barStyle(data)", :data="data.steps", v-tooltip="makeTooltip(data)")
  loading.is-vertical-aligned.has-text-shadow(
    v-else,
    title="Fetching your steps",
    :debounce="0"
  )
  .bottom-axis.has-filter-shadow
    .axis-label(v-for="t in timeIntervals") {{t.value}}
      span(v-if="mode === 'day'") {{t.unit}}

  .x-label Time of day today - Morning to Evening
</template>

<script>
import { COLOUR_MAP } from '@/constants'
import Loading from '@/components/layout/Loading'
import moment from 'moment-mini'

export default {
  components: { Loading },
  props: {
    mode: { type: String, default: 'day' },
    userData: { type: Object, default: null },
    deploymentUser: { type: Object, required: true }
  },
  computed: {
    formattedData () {
      return Object.keys(this.userData)
        .map(unixTime => ({
          time: new Date(parseInt(unixTime) * 1000),
          steps: this.userData[unixTime]
        }))
    },
    maxSteps () {
      return Math.max(...Object.values(this.userData))
    },
    timeIntervals () {
      if (!this.userData) return [ 'Loading...' ]

      let valueFormat = this.mode === 'day' ? 'h' : 'ddd'
      let unitFormat = this.mode === 'day' ? 'a' : 'ddd'

      let intervals = Object.keys(this.userData).map((t) => {
        return {
          value: moment(t * 1000).format(valueFormat),
          unit: moment(t * 1000).format(unitFormat)
        }
      })

      return Array.from(new Set(intervals))
    }
  },
  methods: {
    barStyle ({ time, steps }) {
      let percentage = (steps / this.maxSteps) * 100
      return {
        'height': `${percentage}%`,
        'background-color': COLOUR_MAP[this.deploymentUser.colour]
      }
    },
    toTime (date) {
      let format = t => t <= 12 ? `${t}am` : `${t - 12}pm`
      return format(date.getHours())
    },
    makeTooltip (data) {
      let when = moment(data.time)
        .format(this.mode === 'day' ? 'ha' : 'dddd')

      let pre = this.mode === 'day' ? 'at' : 'on'

      return { content: `${data.steps} steps ${pre} ${when}` }
    }
  }
}
</script>

<style lang="sass">

@keyframes chart-bar-appear
  from
    height: 0

$height: 280px

.steps-chart
  .loading
    height: $height
    .title
      color: $white

.tablet-app .is-glossed
  padding: 1rem 2rem

  .bars
    height: $height
    display: flex
    align-items: flex-end

    .bar
      flex: 1
      border-radius: 0.3em 0.3em 0 0
      animation: chart-bar-appear 0.5s ease-out
      animation-fill-mode: both

      @for $i from 1 through 20
        &:nth-child(#{$i})
          animation-delay: ($i * 0.05s)

      &:not(:first-child)
        margin-left: 5px

  .bottom-axis
    margin-top: 0.6rem
    display: flex
    &> *
      flex: 1

    .axis-label span
      font-size: 12px

  .x-label
    text-align: center
    margin-top: 0.6rem

.chart-grow-enter-active, .chart-grow-leave-active
  transition: height 0.3s

.chart-grow-enter, .chart-grow-leave-to
  transition: height 0.3s

.tooltip
  display: block !important;
  z-index: 10000;

  .tooltip-inner
    background: black;
    color: white;
    border-radius: 16px;
    padding: 5px 10px 4px;

  .tooltip-arrow
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
    border-color: black;
    z-index: 1;

  &[x-placement^="top"]
    margin-bottom: 5px;

    .tooltip-arrow
      border-width: 5px 5px 0 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      bottom: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;

  &[x-placement^="bottom"]
    margin-top: 5px;

    .tooltip-arrow
      border-width: 0 5px 5px 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-top-color: transparent !important;
      top: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;

  &[x-placement^="right"]
    margin-left: 5px;

    .tooltip-arrow
      border-width: 5px 5px 5px 0;
      border-left-color: transparent !important;
      border-top-color: transparent !important;
      border-bottom-color: transparent !important;
      left: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;

  &[x-placement^="left"]
    margin-right: 5px;

    .tooltip-arrow
      border-width: 5px 0 5px 5px;
      border-top-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      right: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;

  &.popover
    $color: #f9f9f9;

    .popover-inner
      background: $color;
      color: black;
      padding: 24px;
      border-radius: 5px;
      box-shadow: 0 5px 30px rgba(black, .1);

    .popover-arrow
      border-color: $color;

  &[aria-hidden='true']
    visibility: hidden;
    opacity: 0;
    transition: opacity .15s, visibility .15s;

  &[aria-hidden='false']
    visibility: visible;
    opacity: 1;
    transition: opacity .15s;

</style>
