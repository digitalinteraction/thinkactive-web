
export default {
  orgById: state => id => {
    id = parseInt(id) || null
    return state.orgs.find(org => org.id === id)
  },
  deploymentById: state => id => {
    id = parseInt(id) || null
    return state.deployments.find(dep => dep.id === id)
  },
  deploymentsForOrg: state => id => {
    id = parseInt(id) || null
    return state.deployments.filter(d => d.organisationId === id)
  },
  deploymentUsers: state => deploymentId => {
    return state.deploymentUsers.filter(d => d.deploymentId === deploymentId)
  },
  deploymentChallenges: state => deploymentId => {
    return state.challenges.filter(c =>
      c.deploymentId === deploymentId &&
      c.deletedAt === null
    )
  },
  deploymentChallengeById: state => challengeId => {
    return state.challenges.find(c => c.id === challengeId)
  },
  deploymentUserById: state => id => {
    return state.deploymentUsers.find(depUser => depUser.id === id)
  },
  activeDeploymentUsers: state => deploymentId => {
    return state.deploymentUsers.filter(depUser =>
      depUser.deploymentId === deploymentId &&
      state.activeDeploymentUserIds.includes(depUser.id)
    )
  },
  foodById: state => foodId => {
    return state.foods.find(food => food.id === foodId)
  }
}
