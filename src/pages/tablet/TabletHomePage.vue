<template lang="pug">
.tablet-home.is-vertical-aligned
  square-svg.tablet-block.is-centered
    g.avatars-radar
      radar-avatar(
        v-for="depUser, i in activeDeploymentUsers",
        :key="depUser.id",
        :deployment-user="depUser",
        :index="i",
        :num-deployment-users="activeDeploymentUsers.length"
      )
  .challenge-message.tablet-block.is-centered
    loading.has-text-white(v-if="!stepData", title="", :debounce="0")
    ambient-message(v-else-if="!messageComponent", :step-data="stepData")
    component(
      v-else,
      :is="messageComponent",
      :challenge="activeChallenge",
      :deployment-users="deploymentUsers"
      :step-data="stepData"
    )
</template>

<script>
import { NATIVE_EVENTS, ROUTES, MUTATIONS } from '@/constants'
import { DeploymentParamMixin, EventsMixin, DatesMixin, TimersMixin } from '@/mixins'
import { SplashMessageBus } from '@/busses'

import ApiBlock from '@/components/layout/ApiBlock'
import Counter from '@/components/layout/Counter'
import Loading from '@/components/layout/Loading'
import SquareSvg from '@/components/tablet/SquareSvg'
import RadarAvatar from '@/components/tablet/RadarAvatar'

import AmbientMessage from '@/components/tablet/AmbientMessage'
import CollabTotalMessage from '@/components/tablet/CollabTotalMessage'
import GroupTotalMessage from '@/components/tablet/GroupTotalMessage'
import GroupAverageMessage from '@/components/tablet/GroupAverageMessage'
import CollabAverageMessage from '@/components/tablet/CollabAverageMessage'

export default {
  components: { ApiBlock, Counter, Loading, SquareSvg, RadarAvatar, AmbientMessage },
  mixins: [ DeploymentParamMixin, EventsMixin, DatesMixin, TimersMixin ],
  data: () => ({
    isLoading: false,
    errors: [],
    stepData: null
  }),
  intervals: {
    fetchData: 5 * 60 * 1000
  },
  computed: {
    // canShowMessage () {
    //   return this.activeChallenge && this.stepData !== null
    // },
    deploymentUsers () {
      return this.$store.getters.deploymentUsers(this.deploymentId)
    },
    activeDeploymentUsers () {
      return this.$store.getters.activeDeploymentUsers(this.deploymentId)
    },
    challenges () {
      return this.$store.getters.deploymentChallenges(this.deploymentId)
    },
    activeChallenge () {
      let now = new Date()
      return this.challenges.find(c =>
        now > this.startOfDay(c.start) && now < this.endOfDay(c.end)
      )
    },
    messageComponent () {
      if (!this.activeChallenge) return null
      if (this.activeChallenge.mode === 'EVERYONE') {
        return this.activeChallenge.metric === 'AVERAGE'
          ? CollabAverageMessage
          : CollabTotalMessage
      } else {
        return this.activeChallenge.metric === 'AVERAGE'
          ? GroupAverageMessage
          : GroupTotalMessage
      }
    }
  },
  mounted () {
    this.listenFor(NATIVE_EVENTS.DEVICE_SCANNED, this.deviceScanned, this.$native)
    this.listenFor(NATIVE_EVENTS.FOOD_SCANNED, this.foodScanned, this.$native)
    this.listenFor(NATIVE_EVENTS.QUESTION_SET, this.questionSet, this.$native)
    this.fetchData()
  },
  methods: {
    deviceScanned ({ deploymentUserId, batterLevel }) {
      this.$router.push({
        name: ROUTES.DEVICE_SYNC,
        params: {
          deployment_id: this.$route.params.deployment_id,
          deployment_user_id: deploymentUserId
        }
      })
    },
    foodScanned ({ foodId }) {
      this.$router.push({
        name: ROUTES.FOOD_DETAIL,
        params: {
          food_id: foodId
        }
      })
    },
    questionSet ({ questionId }) {
      this.$router.push({
        name: ROUTES.DEVICE_SYNC,
        params: {
          question_id: questionId
        }
      })
    },
    async fetchData () {
      this.isLoading = true

      // Fetch challenges first to see if there is an active one
      await this.fetchChallenges()

      // The date to get data from
      let from = this.activeChallenge
        ? this.startOfDay(this.activeChallenge.start)
        : this.previousNDays(7)

      // The date to stop collecting data
      let to = this.activeChallenge
        ? this.endOfDay(this.activeChallenge.end)
        : this.endOfDay(new Date())

      // Fetch steps data
      await this.fetchSteps(from, to)

      this.isLoading = false
    },
    async fetchChallenges () {
      let { meta, data } = await this.$api.getChallenges(this.deploymentId)
      this.$store.commit(MUTATIONS.CHALLENGES, data || [])
      return { meta, data }
    },
    async fetchSteps (from, to) {
      let ids = this.deploymentUsers.map(du => du.id)

      let { meta, data } = await this.$api.getDeviceData(
        this.deploymentId, ids, from, to, 24, 'HOUR'
      )

      this.stepData = meta.success ? Object.freeze(data) : null

      if (!meta.success) {
        SplashMessageBus.$emit('message', {
          body: `Failed to fetch data - ${meta.messages.join()}`,
          type: 'danger'
        })
      }

      return { meta, data }
    }
  }
}
</script>

<style lang="sass">
.tablet-home
  height: 100%
  overflow: hidden
  position: relative
  user-select: none

  svg
    width: 100vmin
    height: 100vmax

  .challenge-message
    +position(absolute, 25vh, 0)
    width: 50vmin
    margin: auto
    font-size: 4vmin
    display: flex
    justify-content: center
    flex-direction: column
    color: white
    line-height: 1.1

  .group-message
    .top
      margin-bottom: 0.5em
    .group
      font-size: 0.75em
      margin-bottom: 0.1em
      display: flex
      justify-content: space-between
      .unit
        font-size: 0.6em

  .collab-message
    .top
      margin-bottom: 1.2em
    .pre-target
      font-size: 0.7em
    .target
      font-size: 2.3em
    .post-target
      font-size: 0.7em
    .bottom
      margin-top: 1.2em
    .success
      font-size: 1.1em
      font-weight: bold
      text-decoration: underline
</style>
