<template lang="pug">
.device-sync-page.is-vertical-aligned.has-text-centered(
  v-if="deploymentUser"
)
  .tablet-block.is-top
    h1.is-size-1.has-text-white.top-message.has-text-shadow
      | Hey, {{ deviceName }}!
  .tablet-block.is-left
    square-svg
      device-avatar.current-device(:deployment-user="deploymentUser", :showState="true", :size="50")
  .tablet-block.is-bottom
    h2.is-size-2.has-text-white.bottom-message.has-text-shadow
      fa(icon="circle-notch", spin, size="2x")
      br
      |
      span {{ displayText }}
.loading.is-vertical-aligned.has-text-centered.has-text-shadow(v-else)
  h1.title.is-1.has-text-white LOADING ...
</template>

<script>
import { NATIVE_EVENTS, ROUTES, TABLET_ERROR, SYNC_EVENTS } from '@/constants'
import { DeploymentParamMixin, EventsMixin, TimersMixin, DeploymentUserParamMixin } from '@/mixins'

import SquareSvg from '@/components/tablet/SquareSvg'
import DeviceAvatar from '@/components/tablet/DeviceAvatar'

const STATE = {
  LOADING: 'loading',
  SYNCING: 'syncing',
  LEAVING: 'leaving'
}

export default {
  components: { SquareSvg, DeviceAvatar },
  mixins: [ DeploymentParamMixin, DeploymentUserParamMixin, TimersMixin, EventsMixin ],
  data: () => ({
    questionData: null,
    state: STATE.LOADING,
    displayText: 'We\'re just saving your data',
    userState: null,
    requestQuery: {}
  }),
  computed: {
    pageClasses () {
      return [ `is-${this.state}` ]
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      this.state = STATE.LOADING

      console.log('fetching Users')
      // Refetch data to ensure we have the latest version
      await this.fetchDeploymentUsers()

      // Start the sync
      if (this.deploymentUser) {
        this.handleQuestion()
        this.listenFor(NATIVE_EVENTS.FOOD_SCANNED, this.foodScanned, this.$native)
        this.startSync(this.deploymentUser)
      } else {
        // Fail if the user was not found
        this.$router.push({
          name: ROUTES.TABLET_ERROR,
          params: {
            deployment_id: this.$route.params.deployment_id,
            error_type: TABLET_ERROR.UNKNOWN_USER
          }
        })
      }
    },
    async startSync (deploymentUser) {
      console.log('starting sync...')
      this.state = STATE.SYNCING
      this.$native.$emit(SYNC_EVENTS.START_SYNC, deploymentUser)
    },
    async handleQuestion () {
      console.log('Fetching Question')
      await this.fetchQuestion()
      if (this.questionData) {
        // console.log(this.questionData.text)
        this.displayText = this.questionData.text
        // console.log(this.deploymentUser)
      } else {
        console.log('NO QUESTION SET')
        this.$native.$emit(SYNC_EVENTS.FOOD_QUESTION_COMPLETED)
      }
    },
    async fetchQuestion () {
      // Question Policy
      // 1. Get current state of user
      // 2. Check question progress / level
      // 3. If not answered correctly && attempts < 3, re-issue question
      await this.fetchUserState()
      if (this.userState) {
        if (!this.userState.questionAnsweredCorrectly && this.userState.questionAttemptNumber < 3) {
          await this.fetchQuestionById(this.userState.lastQuestionId)

          // Re-issue and return
          this.logUserState(false)
          // console.log('Question: ' + this.questionData.id + ' Re-issued. Attempt Number: ' + this.userState.questionAttemptNumber)
          return
        }
      }

      // 4. Choose new *unanswered* question based on this week's level (get from where?)
      let level = 2 // get level from week / progress?

      // -- Temporary Code until Logging Backend is implemented --
      let questions = []
      let { meta, data } = await this.fetchAllQuestions()
      if (!meta.success) {
        meta.messages = [ 'Questions not found' ]
      } else {
        questions = data
        let levelQuestions = []
        let lastQuestionId = 0
        if (this.userState) lastQuestionId = this.userState.lastQuestionId
        questions.forEach(q => {
          if (q.level === level && q.id !== lastQuestionId) levelQuestions.push(q) // just checks last state, could check all?
        })
        if (levelQuestions.length > 0) this.questionData = levelQuestions[Math.floor(Math.random() * levelQuestions.length)]
        console.log('New Question Issued: ')
        this.logUserState(false, true)
      }
    },
    async fetchQuestionById (id) {
      let { meta, data } = await this.$api.getQuestion(parseInt(id))
      if (!meta.success) {
        meta.messages = [ 'Question not found' ]
      } else {
        this.questionData = data
      }
      return { meta, data }
    },
    async fetchAllQuestions () {
      let { meta, data } = await this.$api.getAllQuestions()
      if (!meta.success) {
        meta.messages = [ 'Question not found' ]
      }
      return { meta, data }
    },
    async fetchUserState () {
      let { meta, data } = await this.$api.getDeploymentUserState(this.deploymentUser.id)

      if (meta.success) {
        this.userState = data
      }
    },
    async foodScanned ({ foodId }) {
      let { meta, data } = await this.$api.getFood(parseInt(foodId))
      if (!meta.success) {
      // handle error with redirect
      } else {
        let foodData = data
        console.log(foodData)
        // Question Format:
        // FoodGroups Indexes: 0 = Carbs, 1 = Fruit and Veg, 2 = Protein, 3 = Dairy, 4 = Fat
        // State Indexes: 0 = Happy/Stressed, 1 = Strong/Weak, 2 = Tired/Refreshed, 3 = Low/High Energy, 4 = Ill/Healthy, 5 = Hungry/Full
        // Answer Type: 0 = Food
        // Answer Req: 0 = Has Any, 1 = Has All
        // Anwer Contents: depends on above, e.g. Type = Food, Req = Has, Content = "energy=2" measn the answer needs to be a food card with high energy.
        // Results: The state/foodgroup after a 'correct' answer
        // { id: 4, text: '...', questionFoodGroup: [ 2, 1, 1, 1, 2 ], questionState: [ 0, 1, 1, 1, 0, 1 ], answerType: 0, answerRequirement: 0, answerContents: 'group=4,group=0', resultFoodGroup: [ 1, 1, 1, 1, 1 ], resultState: [ 1, 1, 1, 1, 1, 1 ] }
        // FOOD: { id: 1, name: 'lettuce', group: 0, energy: 1, fat: 0, sugar: 0 }

        if (this.questionData) {
          if (this.questionData.answerType === 0) { // i.e. a food question
            let terms = this.questionData.answerContents.split(',')
            let answerCorrect = false

            // Check all terms in contents:
            for (let i = 0; i < terms.length; ++i) {
              let term = terms[i]
              let termType = term.split('=')[0]
              let termValue = term.split('=')[1]

              // Check By Each Type
              if (termType.includes('group')) answerCorrect = foodData.group === parseInt(termValue)
              else if (termType.includes('energy')) answerCorrect = foodData.energy === parseInt(termValue)
              else if (termType.includes('fat')) answerCorrect = foodData.fat === parseInt(termValue)
              else if (termType.includes('sugar')) answerCorrect = foodData.sugar === parseInt(termValue)

              // Debugging
              /* console.log('' + foodData.name + foodData.group + foodData.energy + foodData.fat + foodData.sugar)
              console.log(term)
              console.log(answerCorrect)
              console.log(this.questionData.answerRequirement)
              if (this.questionData.answerRequirement === 0) console.log('has any...')
              else if (this.questionData.answerRequirement === 1) console.log('has all...') */

              // Check Finished
              if (this.foodCheckFinished(answerCorrect)) break
            }
            // console.log('Question Answered: ' + this.questionData.id + 'correct = ' + answerCorrect)
            this.logUserState(answerCorrect)
            // console.log('Attempt Number: ' + this.userState.questionAttemptNumber)
          }
        }

        this.state = STATE.LEAVING
        await new Promise(resolve => setTimeout(resolve, 1000))

        const questionResponse = {
          foodId,
          questionData: this.questionData,
          userState: this.userState
        }

        console.log('questionResponse')
        console.log(this.userState)

        this.$native.$emit(SYNC_EVENTS.FOOD_QUESTION_COMPLETED, questionResponse)
      }
      return { meta, data }
    },
    foodCheckFinished (answer) {
      if (this.questionData.answerRequirement === 0) return answer // Has One - one correct answer is enough to finish
      else if (this.questionData.answerRequirement === 1) return !answer // Has All - one false answer is enough to finish
      return false
    },
    async logUserState (answerCorrect, questionIsNew = false) {
      let attempts = 1
      if (!questionIsNew && this.userState) attempts = this.userState.questionAttemptNumber + 1

      if (this.questionData) {
        if (questionIsNew) console.log('New Question Attempts:' + attempts)
        // log change
        let newUserState = {
          deploymentUserId: this.deploymentUser.id,
          lastQuestionId: this.questionData.id,
          questionAttemptNumber: attempts,
          questionAnsweredCorrectly: answerCorrect
        }

        this.userState = newUserState
        await this.$api.logDeploymentUserState(this.deploymentUser.id, newUserState)
      }
    }
  }
}

</script>

<style lang="sass">

$text-margin: 0.5em

.device-sync-page
  .avatar-canvas
    width: 50vmin
    height: 50vmin

  .avatar-svg
    width: 35vmin
    height: 35vmin

  .top-message
    margin-bottom: $text-margin
    font-weight: bold
    font-size: 2vh

  .bottom-message
    margin-top: $text-margin

</style>
