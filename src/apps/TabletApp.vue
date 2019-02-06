<template lang="pug">
.tablet-app(:style="appStyle")
  //- debug-tablet-nav(:back-route="deploymentViewRoute")
  template(v-if="hasInitiallyLoaded && deployment")
    transition(name="tablet-page", :duration="300", mode="out-in")
      router-view(:key="$route.name")
  splash-message
</template>

<script>
import { ROUTES, NATIVE_EVENTS, SYNC_EVENTS, MUTATIONS, TABLET_ERROR } from '@/constants'
import { TimersMixin, DeploymentParamMixin, EventsMixin } from '@/mixins'
import SplashMessage from '@/components/structure/SplashMessage'
import DebugTabletNav from '@/components/tablet/DebugTabletNav'

const bgColours = [
  '#2eb9f6'
]

// Sub routes are not rendered unless the deployment AND users are fetched

export default {
  components: { SplashMessage, DebugTabletNav },
  mixins: [ TimersMixin, DeploymentParamMixin, EventsMixin ],
  data: () => ({
    deviceData: null,
    showDebug: false,
    backgroundColor: '#ffffff',
    hasInitiallyLoaded: false,
    syncFinished: false,
    questionFinished: false,
    foodDisplayFinished: false,
    syncTimerId: null,
    foodTimerId: null,
    deviceSyncTimeoutPeriod: 1000 * 60 * 3, // 3 minutes
    foodQuestionSyncTimeoutPeriod: 1000 * 15 // 15 seconds
  }),
  computed: {
    appStyle () {
      return { 'background-color': this.backgroundColor }
    }
  },
  watch: {
    '$route.params.deployment_id' () { this.fetchDeployment() }
  },
  intervals: {
    colourTick: 20 * 1000, // Every 20 seconds
    fetchData: 10 * 60 * 1000 // Every 5 minutes
  },
  mounted () {
    this.listenFor(NATIVE_EVENTS.FORCE_TABLET_HOME, this.navigateHome, this.$native)
    this.listenFor(NATIVE_EVENTS.DEVICE_JOINED, this.deviceJoined, this.$native)
    this.listenFor(NATIVE_EVENTS.DEVICE_LEFT, this.deviceLeft, this.$native)
    this.listenFor(NATIVE_EVENTS.EXIT_TABLET, this.exitTablet, this.$native)
    this.listenFor(NATIVE_EVENTS.RECIEVED_DATA, this.recievedData, this.$native)
    this.listenFor(NATIVE_EVENTS.REQUEST_DATA_FAILED, this.syncRequestFailed, this.$native)
    this.listenFor(SYNC_EVENTS.START_SYNC, this.startSync, this.$native)
    this.listenFor(SYNC_EVENTS.FOOD_QUESTION_COMPLETED, this.foodQuestionCompleted, this.$native)

    this.fetchData().then(() => {
      this.hasInitiallyLoaded = true
      if (this.deployment) return
      this.$router.replace({ name: ROUTES.NOT_FOUND })
    })
    this.colourTick()
  },
  methods: {
    async fetchData () {
      // Fetch the deployment & its users at the same time
      let [, users] = await Promise.all([
        this.fetchDeployment(),
        this.fetchDeploymentUsers()
      ])

      // Send the event to native
      this.$native.$emit(NATIVE_EVENTS.SET_DEPLOYMENT_USERS, users.data)
    },
    navigateHome () {
      this.$router.push({
        name: ROUTES.TABLET_HOME,
        params: this.$route.params
      })
    },
    deviceJoined ({ deploymentUserId }) {
      this.$store.commit(MUTATIONS.DEPLOYMENT_USER_JOINED, deploymentUserId)
    },
    async deviceLeft ({ deploymentUserId }) {
      let device = this.$store.getters.deploymentUserById(deploymentUserId)
      if (device) device.state = 'leaving'
      await new Promise(resolve => setTimeout(resolve, 300))
      this.$store.commit(MUTATIONS.DEPLOYMENT_USER_LEFT, deploymentUserId)
      if (device) device.state = 'active'
    },
    exitTablet () {
      this.clearSyncTimeout()
      this.$router.push(this.deploymentRoute)
    },
    colourTick () {
      this.backgroundColor = bgColours[Math.floor(Math.random() * bgColours.length)]
    },
    async startSync (deploymentUser) {
      this.syncFinished = false

      // Request data from the native side
      this.$native.$emit(NATIVE_EVENTS.REQUEST_DATA, deploymentUser)

      // Add a timeout to fail if no response is recieved
      this.syncTimerId = this.addTimeout(this.deviceSyncTimeoutPeriod, this.syncRequestFailed)
    },
    async recievedData (payload) {
      console.log('Recieving Data')
      this.deviceData = payload
      this.syncFinished = true

      // Post data up to server
      let { meta } = await this.$api.uploadDeviceData(
        this.deploymentId,
        payload.deploymentUserId,
        payload.deploymentDeviceId,
        payload
      )

      // Go to the detail page or fail depending on the result
      if (meta.success) {
        // Update the deployment User
        this.$store.commit(MUTATIONS.DEPLOYMENT_USERS, [
          {
            ...this.deploymentUser,
            lastRTC: payload.lastRTC,
            lastSyncTime: payload.lastSyncTime,
            lastBlockSynced: payload.lastBlockSynced
          }
        ])

        // Update the native's deployment users
        this.$native.$emit(
          NATIVE_EVENTS.SET_DEPLOYMENT_USERS,
          this.$store.getters.deploymentUsers(this.deploymentId)
        )

        this.removeTimeout(this.syncTimerId)

        this.requestQuery = { battery: payload.batteryLevel }
        this.syncRequestSucceeded()
      } else {
        this.syncRequestFailed()
      }
    },
    foodQuestionCompleted (questionResponse) {
      this.questionFinished = true

      console.log('foodQuestionCompleted called')
      // If the user has responded to the question then proceed to showing the food screen
      if (questionResponse) {
        this.$router.push({
          name: ROUTES.FOOD_DETAIL,
          params: { ...this.$route.params, food_id: questionResponse.foodId, questionData: questionResponse.questionData, userState: questionResponse.userState }
        })
      } else {
        // don't show a food screen just proceed
        this.syncRequestSucceeded()
      }
    },
    syncRequestSucceeded () {
      // user has synced but not answered question
      if (this.syncFinished && this.questionFinished) {
        // Push the detail page
        console.log('going to detail page')
        this.$router.push({
          name: ROUTES.DEVICE_DETAIL,
          params: this.$route.params,
          query: this.requestQuery
        })
      } else if (!this.syncFinished) {
        console.log('waiting for Sync...')
        // user has answered question but not synced
      } else if (!this.questionFinished) {
        console.log('waiting for Question...')
        this.foodTimerId = this.addTimeout(this.foodQuestionSyncTimeoutPeriod, this.foodQuestionCompleted)
      }
    },
    syncRequestFailed () {
      // Show an error
      this.$router.push({
        name: ROUTES.TABLET_ERROR,
        params: {
          ...this.$route.params,
          error_type: TABLET_ERROR.SYNC_FAILED
        }
      })
      this.clearSyncTimeout()
    },
    clearSyncTimeout () {
      // remove data await timeouts
      clearTimeout(this.syncTimerId)
      clearTimeout(this.foodTimerId)
    }
  }
}
</script>

<style lang="sass">

$duration: 0.6s
$elem-offset: 50vmin

.navbar.is-dark
  .navbar-burger span
    background-color: $white

.tablet-app
  display: flex
  flex-direction: column
  height: 100vh
  transition: background-color 10s

  > *:not(header):not(.splash-message)
    flex: 1

  h1, h2, h3, h4, h5, h6
    font-weight: 600

  .is-glossed
    border-radius: 1rem
    background-color: rgba(255,255,255,0.3)
    box-shadow: 0 0 5px rgba(0,0,0,0.2)
    padding: 1.5rem 2.5rem

  .tablet-block
    opacity: 1
    transform: translate(0, 0) scale(1)
    transition: transform $duration, opacity $duration

  .tablet-page-enter .tablet-block
    opacity: 0
    &.is-top
      transform: translate(0, -$elem-offset) scale(0.5)
    &.is-left
      transform: translate(-$elem-offset, 0) scale(0.5)
    &.is-centered
      transform: translate(0, 0) scale(0.5)
    &.is-bottom
      transform: translate(0, $elem-offset) scale(0.5)

  .tablet-page-leave-to .tablet-block
    opacity: 0
    &.is-top
      transform: translate(0, -$elem-offset) scale(0.5)
    &.is-left
      transform: translate($elem-offset, 0) scale(0.5)
    &.is-centered
      transform: translate(0, 0) scale(0)
    &.is-bottom
      transform: translate(0, $elem-offset) scale(0.5)

</style>
