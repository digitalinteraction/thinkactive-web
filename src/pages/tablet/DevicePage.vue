<template lang="pug">
.device-page.is-vertical-aligned.has-text-centered.has-text-white(
  @mouseup="restartTimer",
  @touchend="restartTimer"
)
  button.modal-close.is-large(v-on:click="navigateHome")

  h1.top-message.is-size-1.has-text-white.has-text-shadow
    | Welcome back, {{ deviceName }}!
  square-svg.avatar-svg.has-filter-shadow
    device-avatar(
      :deployment-user="deploymentUser",
      :size="50",
      :showState="true",
      ref="avatar"
    )
  .tablet-block.is-bottom.steps-block.has-text-white
    h3.has-text-shadow.is-size-4.generated-message
      | {{ 'You have walked ' }}
      counter(:to="dailySteps", :duration="2000")
      |  steps {{ chartMode === 'day' ? 'today' : 'this week' }}
    .buttons.is-centered.has-addons.mode-control
      button.button(@click="chartMode = 'day'", :class="buttonClasses('day')")
        | Today
      button.button(@click="chartMode = 'week'", :class="buttonClasses('week')")
        | This week
    steps-chart(
      :user-data="userData",
      :mode="chartMode",
      :deployment-user="deploymentUser"
    )
    //- .chart-padder(v-else)
</template>

<script>
import { ROUTES, TABLET_ERROR } from '@/constants'

import {
  DeploymentParamMixin, DeploymentUserParamMixin, EventsMixin, PopmotionMixin
} from '@/mixins'

import { SplashMessageBus } from '@/busses'

import SquareSvg from '@/components/tablet/SquareSvg'
import DeviceAvatar from '@/components/tablet/DeviceAvatar'
import StepsChart from '@/components/tablet/StepsChart'
import Counter from '@/components/layout/Counter'
import Loading from '@/components/layout/Loading'

const PageTimeout = 15 * 1000

export default {
  components: { SquareSvg, DeviceAvatar, StepsChart, Counter, Loading },
  mixins: [ DeploymentParamMixin, DeploymentUserParamMixin, EventsMixin, PopmotionMixin ],
  data: () => ({
    timer: null,
    userData: null,
    chartMode: 'day'
  }),
  computed: {
    dailySteps () {
      if (!this.userData) return null
      return Object.values(this.userData)
        .reduce((a, b) => a + b, 0)
    },
    lowBattery () {
      return this.$route.query.battery !== null &&
        this.$route.query.battery !== undefined &&
        parseInt(this.$route.query.battery) < 25
    }
  },
  watch: {
    chartMode (newMode) { this.fetchData() }
  },
  mounted () {
    this.scheduleReset()
    this.fetchData()

    // Warn the user if there is a low battery
    if (this.lowBattery) {
      SplashMessageBus.$emit('message', {
        body: 'You need to charge your battery',
        type: 'danger',
        length: 15 * 1000
      })
    }
  },
  destroyed () {
    clearTimeout(this.timer)
    this.timer = null
  },
  methods: {
    scheduleReset () {
      if (this.$route.query.no_timeout !== undefined) return
      this.timer = setTimeout(this.navigateHome, PageTimeout)
    },
    restartTimer () {
      clearTimeout(this.timer)
      this.scheduleReset()
    },
    navigateHome () {
      this.$router.push({
        name: ROUTES.TABLET_HOME,
        params: this.$route.params
      })
    },
    buttonClasses (mode) {
      return this.chartMode === mode
        ? [ 'is-primary', 'is-inverted' ]
        : [ 'is-inverted' ]
    },
    async fetchData () {
      this.userData = null

      let startDate = new Date()
      let endDate = new Date()
      let magnitude
      let unit

      if (this.chartMode === 'day') {
        startDate.setHours(startDate.getHours() - 12, 0, 0, 0)
        endDate.setHours(18, 0, 0, 0)
        magnitude = 1
        unit = 'HOUR'
      } else {
        startDate.setDate(startDate.getDate() - 6)
        startDate.setHours(6, 0, 0, 0)
        endDate.setHours(18, 0, 0, 0)
        magnitude = 1
        unit = 'DAY'
      }

      let { meta, data } = await this.$api.getDeviceData(
        this.deploymentId,
        [ this.deploymentUserId ],
        startDate,
        endDate,
        magnitude,
        unit
      )

      if (!meta.success) {
        this.$router.push({
          name: ROUTES.TABLET_ERROR,
          params: { error_type: TABLET_ERROR.FETCH_FAILED }
        })
      } else {
        this.userData = data[this.deploymentUserId]
      }
    }
  }
}
</script>

<style lang="sass">
.device-page
  .top-message
    margin-bottom: 1rem
    padding-top: 2rem

  .avatar-svg
    width: 25vmin
    height: 25vmin

  .steps-block
    margin: 1.5rem auto
    width: 90vw
    max-width: 640px

    .generated-message, .mode-control
      margin-bottom: 0.75em

  .modal-close
    background-color: rgba(103, 103, 103, 0.3)

  .chart-padder
    height: 395px

</style>
