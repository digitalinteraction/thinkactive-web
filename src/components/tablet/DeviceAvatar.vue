<template lang="pug">
g.device-avatar
  circle.circle(:r="size * 0.8", :fill="fillColor", :stroke-width="size * 0.07", stroke="white")
  use.animal(
    :xlink:href="animalPath",
    fill="white",
    :width="size * 0.8",
    :height="size * 0.8",
    :x="-size * 0.4",
    :y="-size * 0.4"
  )
  g.stateGroup(v-if="showState")
    use(
      :href="stateHappyPath",
      :width="size / 2",
      :height="size / 2",
      :x="-size * 0.25",
      :y="size / 2"
    )
    use(
      :href="stateStrongPath",
      :width="size / 2",
      :height="size / 2",
      :x="-size * 0.25 + size / 2 + size * 0.2",
      :y="-size * 0.25 + size / 3"
    )
    use(
      :href="stateRefreshedPath",
      :width="size / 2",
      :height="size / 2",
      :x="-size * 0.25 + size / 2 + size * 0.2",
      :y="-size * 0.25 - size / 3"
    )
    use(
      :href="stateEnergeticPath",
      :width="size / 2",
      :height="size / 2",
      :x="-size * 0.25 - size / 2 - size * 0.2",
      :y="-size * 0.25 - size / 3"
    )
    use(
      :href="stateHealthyPath",
      :width="size / 2",
      :height="size / 2",
      :x="-size * 0.25 - size / 2 - size * 0.2",
      :y="-size * 0.25 + size / 3"
    )
    use(
      :href="stateFullPath",
      :width="size / 2",
      :height="size / 2",
      :x="-size * 0.25",
      :y="-size * 0.5 - size / 2"
    )
</template>

<script>
import { COLOUR_MAP, ROUTES, TABLET_ERROR } from '@/constants'
import TimersMixin from '@/mixins/TimersMixin'

// FoodGroups Indexes: 0 = Carbs, 1 = Fruit and Veg, 2 = Protein, 3 = Dairy, 4 = Fat
// State Indexes: 0 = Happy/Stressed, 1 = Strong/Weak, 2 = Tired/Refreshed, 3 = Low/High Energy, 4 = Ill/Healthy, 5 = Hungry/Full

export default {
  mixins: [ TimersMixin ],
  props: {
    deploymentUser: { type: Object, required: true },
    size: { type: Number, default: 10 },
    showState: { type: Boolean, default: false }
  },
  data: () => ({
    // foodGroupMode: false,
    // foodGroups: [1, 1, 1, 1, 1], // this is not how state and foodgroup are currently stored i.e. it's a hack for now...
    state: [1, 1, 1, 1, 1, 1, 1]
  }),
  computed: {
    fillColor () {
      return COLOUR_MAP[this.deploymentUser.colour]
    },
    animalPath () {
      let animal = this.deploymentUser.animal
      return `/static/avatar/${animal}.svg#Layer_1`
    },
    stateHappyPath () {
      if (parseInt(this.state[0]) > 0) return `/static/state/happy.svg#Layer_1`
      return `/static/state/stress.svg#Layer_1`
    },
    stateStrongPath () {
      if (parseInt(this.state[1]) > 0) return `/static/state/strong.svg#Layer_1`
      return `/static/state/weak.svg#Layer_1`
    },
    stateRefreshedPath () {
      if (parseInt(this.state[2]) > 0) return `/static/state/refreshed.svg#Layer_1`
      return `/static/state/sleepy.svg#Layer_1`
    },
    stateEnergeticPath () {
      if (parseInt(this.state[3]) > 0) return `/static/state/energetic.svg#Layer_1`
      return `/static/state/tired.svg#Layer_1`
    },
    stateHealthyPath () {
      if (parseInt(this.state[4]) > 0) return `/static/state/healthy.svg#Layer_1`
      return `/static/state/ill.svg#Layer_1`
    },
    stateFullPath () {
      if (parseInt(this.state[5]) > 0) return `/static/state/full.svg#Layer_1`
      return `/static/state/hungry.svg#Layer_1`
    }
    /* foodChartPathCarb () {
      return `/static/foodgroup/food_chart_carb.svg#food_chart`
    },
    foodChartPathVeg () {
      return `/static/foodgroup/food_chart_veg.svg#food_chart`
    },
    foodChartPathProtein () {
      return `/static/foodgroup/food_chart_protein.svg#food_chart`
    },
    foodChartPathDairy () {
      return `/static/foodgroup/food_chart_dairy.svg#food_chart`
    },
    foodChartPathFat () {
      return `/static/foodgroup/food_chart_fat.svg#food_chart`
    },
    foodChartColourCarb () {
      return this.colourFromLevel(parseInt(this.foodGroups[0]))
    },
    foodChartColourVeg () {
      return this.colourFromLevel(parseInt(this.foodGroups[1]))
    },
    foodChartColourProtein () {
      return this.colourFromLevel(parseInt(this.foodGroups[2]))
    },
    foodChartColourDairy () {
      return this.colourFromLevel(parseInt(this.foodGroups[3]))
    },
    foodChartColourFat () {
      return this.colourFromLevel(parseInt(this.foodGroups[4]))
    } */
  },
  mounted () {
    this.fetchData()
  },
  /* intervals: {
    stateTick: 10 * 1000 // Every 10 seconds
  }, */
  methods: {
    /* stateTick () {
      this.foodGroupMode = !this.foodGroupMode
    }, */
    colourFromLevel (level) {
      if (level === 0) return 'gray'
      else if (level === 1) return 'green'
      return 'red'
    },
    async fetchData () {
      if (this.showState) {
        let { meta, data } = await this.$api.getDeploymentUserState(this.deploymentUser.id)

        if (meta.success) {
          let userState = data
          // console.log('state fetch success: ')
          // console.log(userState)
          await this.setAvatarStates(userState)
        }
      }
    },
    async setAvatarStates (userState) {
      if (userState) {
        let { meta, data } = await this.$api.getQuestion(userState.lastQuestionId)

        if (!meta.success) {
          this.$router.push({
            name: ROUTES.TABLET_ERROR,
            params: { error_type: TABLET_ERROR.FETCH_FAILED }
          })
        } else {
          // console.log('question: ')
          // console.log(data)
          let question = data
          if (question !== null) {
            this.state = question.questionState
          }
          // this.foodGroups = question.questionFoodGroup
        }
      }
    }
  }
}
</script>

<style lang="sass">
</style>
