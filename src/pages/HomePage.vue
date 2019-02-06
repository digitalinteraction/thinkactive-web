<template lang="pug">
.home-page
  hero.is-primary
    .container
      h1.title Think Active
      h2.subtitle Get young people thinking active with Newcastle United Foundation and Newcastle University
  section.section
    .container.has-text-centered
      .columns
        .column
          p: fa(icon="graduation-cap", size="5x")
          h2.is-size-4 Learn
          p Learn about health and nutrition and being active as part of your local sports club fitness programme.
        .column
          p: fa(icon="compass", size="5x")
          h2.is-size-4 Explore
          p Receive a free fitness band to track your activity levels throughout the day and explore the data in class and at home.
        .column
          p: fa(icon="chart-line", size="5x")
          h2.is-size-4 Go!
          p Get active and move more with engaging weekly step challenges set by your instructor in class.
  hero.is-info.is-bold
    .container
      .columns
        .column
          div
            p.title
              counter(:to="stats.steps")
            p.subtitle.is-6 Steps
        .column
          div
            p.title
              counter(:to="stats.users")
            p.subtitle.is-6 Participants
        .column
          div
            p.title
              counter(:to="stats.deployments")
            p.subtitle.is-6 Projects
        .column
          div
            p.title
              counter(:to="stats.instructors")
            p.subtitle.is-6 Instructors
  section.section
    .container
      .columns
        .column.is-two-fifths
          figure.image.is-4by3
            img(src="/static/home/feature-1.png")
        .column.is-vertical-aligned
          div
            p.is-size-3 Learning about Health and Nutrition
            p.is-size-5.has-text-grey
              | Our goal is to provide an even more engaging programme for young people to learn about how health and fitness can be supported by technology.
  section.section
    .container
      .columns(style="flex-direction: row-reverse;")
        .column.is-two-fifths
          figure.image.is-4by3
            img(src="/static/home/feature-2.png")
        .column.is-vertical-aligned
          div
            p.is-size-3 Understanding Activity Levels
            p.is-size-5.has-text-grey
              | We would like to give each young person a fitness band to wear during the 6 week programme to count their daily number of steps and use this in class and at home to learn about activity levels can effect their health.
  section.section
    .container
      .columns
        .column.is-two-fifths
          figure.image.is-4by3
            img(src="/static/home/feature-3.png")
        .column.is-vertical-aligned
          div
            p.is-size-3 Data as an Educational Resource
            p.is-size-5.has-text-grey
              | As part of providing young people to collect their activity levels we would like to know how teachers could use this as an educational resource to engage students in understanding data literacy.
</template>

<script>
import Hero from '@/components/layout/Hero'
import Counter from '@/components/layout/Counter'

export default {
  components: { Hero, Counter },
  data () {
    return {
      stats: {
        steps: 142011, users: 1209, deployments: 9, instructors: 6
      }
    }
  },
  mounted () {
    this.fetchStats()
  },
  methods: {
    async fetchStats () {
      // let { data } = await this.$api.getStats()
      // this.stats = data
    }
  }
}
</script>

<style>
</style>
