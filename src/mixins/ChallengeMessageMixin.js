import { startOfDay } from './DatesMixin'
// import { TABLET_COLOUR } from '../constants'

/*
 * @vue/component
 * A mixin for components that are a Challenge Message
 */
export default {
  props: {
    stepData: {
      type: Object,
      required: true
    },
    deploymentUsers: {
      type: Array,
      required: true
    }
  },
  methods: {
    challengeDuration (challenge) {
      let start = startOfDay(challenge.start).getTime()
      let end = startOfDay(challenge.end).getTime()
      return Math.ceil((end - start) / (24 * 60 * 60 * 1000))
    },
    countAllSteps (stepData) {
      let total = 0
      for (let id in stepData) {
        for (let epoch in stepData[id]) {
          total += stepData[id][epoch]
        }
      }
      return total
    },
    findGroup (deploymentUserId) {
      deploymentUserId = parseInt(deploymentUserId)
      let user = this.deploymentUsers.find(u => u.id === deploymentUserId)
      return user.colour
    },
    groupStepData (stepData) {
      let groups = {}
      for (let id in stepData) {
        let groupName = this.findGroup(id)
        groups[groupName] = groups[groupName] || 0
        
        for (let epoch in stepData[id]) {
          groups[groupName] += stepData[id][epoch]
        }
      }
      return groups
    },
    sortedGroupStepData (groupStepData) {
      let asArray = Object.keys(groupStepData).map(name => {
        return { name, steps: groupStepData[name] }
      })
      
      return asArray.sort((a, b) => b.steps - a.steps)
    }
  }
}
