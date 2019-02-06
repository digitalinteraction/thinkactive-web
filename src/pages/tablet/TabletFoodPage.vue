<template lang='pug'>
svg.is-tablet-view()
</template>

<script>
import Hero from '@/components/layout/Hero'
import * as d3 from 'd3'

import { TimersMixin, DeploymentUserParamMixin, EventsMixin } from '@/mixins'
import { ROUTES } from '@/constants'

const STATE = {
  LOADING: 'loading',
  VIEWING: 'viewing',
  LEAVING: 'leaving'
}

export default {
  components: { Hero },
  mixins: [TimersMixin, DeploymentUserParamMixin, EventsMixin],
  data: () => ({
    foodData: null,
    state: STATE.LOADING,
    questionData: null,
    userState: null
  }),
  mounted () {
    if (this.$route.params.questionData) {
      this.questionData = this.$route.params.questionData
    }
    if (this.$route.params.userState) {
      console.log('userState:')
      console.log(this.$route.params.userState)
      this.userState = this.$route.params.userState
    }
    this.fetchFood()
  },
  methods: {
    async fetchFood () {
      this.state = STATE.LOADING
      let { meta, data } = await this.$api.getFood(
        parseInt(this.$route.params.food_id)
      )
      if (!meta.success) {
        // TODO: handle error with redirect
      } else {
        this.foodData = data
        this.state = STATE.VIEWING
        this.showView()
      }
    },
    showView () {
      var food = [{ url: '/static/food/' + this.foodData.name + '.svg' }]
      var group = ''
      // FoodGroups Indexes: 0 = Carbs, 1 = Fruit and Veg, 2 = Protein, 3 = Dairy, 4 = Fat
      if (this.foodData.group === 0) group = 'carb'
      else if (this.foodData.group === 1) group = 'Fruit and Veggies'
      else if (this.foodData.group === 2) group = 'Protein'
      else if (this.foodData.group === 3) group = 'Milk and Dairy'
      else if (this.foodData.group === 4) group = 'Fats and Sugars'

      var energy = ''
      if (this.foodData.energy === 0) energy = 'Low Energy'
      else if (this.foodData.energy === 1) energy = 'Medium Energy'
      else if (this.foodData.energy === 2) energy = 'High Energy'

      var fat = ''
      if (this.foodData.fat === 0) fat = 'Low Fat'
      else if (this.foodData.fat === 1) fat = 'Medium Fat'
      else if (this.foodData.fat === 2) fat = 'High Fat'

      var sugar = ''
      if (this.foodData.sugar === 0) sugar = 'Low Sugar'
      else if (this.foodData.sugar === 1) sugar = 'Medium Sugar'
      else if (this.foodData.sugar === 2) sugar = 'High Sugar'

      var groupHighlight = 0
      var energyHighlight = 0
      var fatHighlight = 0
      var sugarHighlight = 0

      // let circleCol = 'white'
      // let circleWidth = 10

      if (this.questionData) {
        let terms = this.questionData.answerContents.split(',')
        for (let i = 0; i < terms.length; ++i) {
          let term = terms[i]
          let termType = term.split('=')[0]

          // Check By Each Type
          if (termType.includes('group')) groupHighlight = 5
          else if (termType.includes('energy')) energyHighlight = 5
          else if (termType.includes('fat')) fatHighlight = 5
          else if (termType.includes('sugar')) sugarHighlight = 5
        }
      }

      var orbiters = [
        {
          circleRadius: 200,
          width: 50,
          phi0: 0,
          url: '/static/foodgroup/' + group + '.svg',
          highlight: groupHighlight,
          value: group,
          type: 'group'
        },
        {
          circleRadius: 200,
          width: 50,
          phi0: 90,
          url: '/static/foodgroup/' + energy + '.svg',
          highlight: energyHighlight,
          value: energy,
          type: 'energy'
        },
        {
          circleRadius: 200,
          width: 50,
          phi0: 180,
          url: '/static/foodgroup/' + fat + '.svg',
          highlight: fatHighlight,
          value: fat,
          type: 'fat'
        },
        {
          circleRadius: 200,
          width: 50,
          phi0: 270,
          url: '/static/foodgroup/' + sugar + '.svg',
          highlight: sugarHighlight,
          value: sugar,
          type: 'sugar'
        }
      ]

      // Basic D3 Setup Objects
      var svg = d3.select(this.$el)
      var w = parseInt(svg.style('width'), 10)
      var h = parseInt(svg.style('height'), 10)
      var container = svg
        .append('g')
        .attr('transform', 'translate(' + w / 2 + ',' + h / 2 + ')')

      // Orbit Circle
      container
        .append('circle')
        .attr('class', function (d) {
          if (this.userState) {
            console.log(this.userState)
            if (this.userState.questionAnsweredCorrectly) {
              return 'orbiter-circle correct'
            } else {
              return 'orbiter-circle incorrect'
            }
          } else {
            return 'orbiter-circle'
          }
        })
        .attr('r', 0)
        .transition()
        .ease(d3.easeExp)
        .duration(1800)
        .attr('r', 200)

      // Groups/Nodes for ALL orbiters
      var nodes = container.append('g').attr('class', 'nodes')

      // Groups/Nodes for EACH orbiter
      var node = nodes
        .selectAll('node')
        .data(orbiters)
        .enter()
        .append('g')

      // add orbiter circles
      node
        .append('circle')
        .transition()
        .duration(function (d, i) {
          return (i + 1) * 300 + 1000
        })
        .ease(d3.easeExp)
        .attr('class', function (d) {
          if (d.type === 'group') {
            return 'orbiter group'
          }
          let level = d.value.split(' ')[0].toLowerCase()
          return `orbiter ${level}`
        })
        .attr('r', function (d) {
          return d.width
        })
        .attr('cx', function (d, i) {
          let angle = (i / (orbiters.length / 2)) * Math.PI
          return (d.circleRadius * Math.cos(angle))
        })
        .attr('cy', function (d, i) {
          let angle = (i / (orbiters.length / 2)) * Math.PI
          return (d.circleRadius * Math.sin(angle))
        })

      // add orbiter text
      node
        .append('text')
        .transition()
        .duration(function (d, i) {
          return (i + 100) * 300 + 1000
        })
        .ease(d3.easeExp)
        .attr('class', 'orbiter-label')
        .attr('x', function (d, i) {
          let angle = (i / (orbiters.length / 2)) * Math.PI
          return (d.circleRadius * Math.cos(angle))
        })
        .attr('y', function (d, i) {
          let angle = (i / (orbiters.length / 2)) * Math.PI
          return (d.circleRadius * Math.sin(angle))
        })
        .attr('text-anchor', 'middle')
        .each(function (d, i) {
          var arr = d.value.split(' ')
          if (arr !== undefined) {
            for (var tspanIndex = 0; tspanIndex < arr.length; tspanIndex++) {
              d3.select(this).append('tspan')
                .attr('fill-opacity', 0)
                .text(function () {
                  return arr[tspanIndex]
                })
                .attr('x', function (d) {
                  let angle = (i / (orbiters.length / 2)) * Math.PI
                  return (d.circleRadius * Math.cos(angle))
                })
                .attr('y', function (d) {
                  let angle = (i / (orbiters.length / 2)) * Math.PI
                  return (d.circleRadius * Math.sin(angle))
                })
                .attr('dy', function (d) {
                  if (arr.length > 2) {
                    return 24 + (-18 * tspanIndex)
                  } else {
                    return 18 * tspanIndex
                  }
                })
                .attr('text-anchor', 'middle')
                .transition()
                .delay(function (d, i) {
                  return 500 + 1000
                })
                .attr('fill-opacity', 1)
            }
          }
        })

      // Central food/Image
      container
        .data(food)
        .append('image')
        .attr('xlink:href', function (d) {
          return d.url
        })
        .attr('width', 30)
        .attr('height', 30)
        .attr('x', -18.75)
        .attr('y', -18.75)
        .transition()
        .ease(d3.easeExp)
        .duration(1000)
        .attr('width', 150)
        .attr('height', 150)
        .attr('x', -75)
        .attr('y', -75)

      this.addTimeout(4 * 1000, () => this.foodTick())
    },
    async foodTick () {
      // Wait a bit longer to animate out
      this.state = STATE.LEAVING
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (this.deploymentUser === undefined) {
        this.$router.push({
          name: ROUTES.TABLET_HOME,
          params: this.$route.params
        })
      } else {
        // we are waiting on the sync to completed
        var svg = d3.select(this.$el)
        var w = parseInt(svg.style('width'), 10)
        var h = parseInt(svg.style('height'), 10)

        var syncMessage = svg.append('text')
          .attr('id', 'sync-text')
          .attr('class', 'sync-message')
          .attr('text-anchor', 'middle')
          .attr('opacity', 0)
          .text('We\'re just saving your activity data')
          .attr('x', function (d) {
            return w / 2
          })
          .attr('y', function (d) {
            return h * 0.9
          })
        repeat()

        // eslint-disable-next-line
        function repeat () {
          syncMessage.transition()
            .duration(1000)
            .attr('opacity', 1)
            .transition()
            .duration(1000)
            .attr('opacity', 0)
            .on('end', repeat)
        }
      }
    }
  }
}
</script>

<style lang="sass">
.orbiter-circle
  fill: none
  stroke-width: 10
  stroke: #FFFFFF

.correct
  stroke: #1d9f75

.incorrect
  stroke: #fa573c

.orbiter
  stroke: #FFFFFF
  stroke-width: 6

.orbiter-label-hidden
  fill-opacity: 0
  display: none

.orbiter-label
  fill-opacity: 1
  fill: rgb(93, 174, 227)
  font-weight: 900

  tspan
    fill: #FFFFFF

.group
  fill: rgb(52,79,137)

.high
  fill: rgb(239, 61, 75)

.medium
  fill: rgb(255, 201, 20)

.low
  fill: rgb(75, 159, 121)

.sync-message
  fill: #FFFFFF
  font-weight: bold
  font-size: 3vh
</style>
