import { MUTATIONS } from '@/constants'

export default {
  [MUTATIONS.LOGGED_IN] (state, user) {
    state.user = user
  },
  [MUTATIONS.LOGGED_OUT] (state) {
    state.deployments = []
    state.deploymentUsers = []
    state.challenges = []
    state.user = null
    state.orgs = []
    state.activeDeploymentUserIds = []
  },
  [MUTATIONS.START_NEW_DEPLOYMENT] (state) {
    state.newDeployment = {
      info: {
        name: '',
        location: '',
        pointOfContact: '',
        organisationId: null,
        baselineFrom: null,
        baselineTo: null,
        activityFrom: null,
        activityTo: null
      },
      devices: [ ]
    }
  },
  [MUTATIONS.UPDATE_NEW_DEPLOYMENT] (state, { info, devices }) {
    state.newDeployment.info = info || state.newDeployment.info
    state.newDeployment.devices = devices || state.newDeployment.devices
  },
  [MUTATIONS.CLEAR_NEW_DEPLOYMENT] (state) {
    state.newDeployment = null
  },
  [MUTATIONS.DEPLOYMENTS] (state, deployments) {
    state.deployments = mergeById(state.deployments, deployments)
  },
  [MUTATIONS.ORGS] (state, orgs) {
    state.orgs = mergeById(state.orgs, orgs)
  },
  [MUTATIONS.CHALLENGES] (state, challenges) {
    state.challenges = mergeById(state.challenges, challenges)
  },
  [MUTATIONS.DEPLOYMENT_USERS] (state, depUsers) {
    depUsers.forEach(u => { u.state = 'active' })
    state.deploymentUsers = mergeById(state.deploymentUsers, depUsers)
  },
  [MUTATIONS.DEPLOYMENT_USER_JOINED] (state, deploymentUserId) {
    if (state.activeDeploymentUserIds.includes(deploymentUserId)) return
    state.activeDeploymentUserIds.push(deploymentUserId)
  },
  [MUTATIONS.DEPLOYMENT_USER_LEFT] (state, deploymentUserId) {
    state.activeDeploymentUserIds = state.activeDeploymentUserIds
      .filter(id => id !== deploymentUserId)
  }
}

/** Returns a shallow copy of setB merged into setA by comparing element.id */
function mergeById (setA, setB) {
  let output = Array.from(setA)
  setB.forEach(value => {
    let index = output.findIndex(existing => existing.id === value.id)
    if (index === -1) {
      output.push(value)
    } else {
      output[index] = value
    }
  })
  return output
}
