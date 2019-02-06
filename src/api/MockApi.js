import { mock, mockList, mockMe, mockDeviceList } from './mock'
import {
  genSiteStats, genUser, genDeployment, genUserDevice, genOrg, genFood, genQuestion, genAllQuestions, genStepsDataBetween, genDeploymentUserState, genChallenge
  // genSiteStats, genUser, genDeployment, genUserDevice, genOrg, genFood, genQuestion, genAllQuestions, genStepsDataBetween, from, to, interval, format, genChallenge

} from './generator'
import ApiInterface from './ApiInterface'
import store from '@/store'

const isEmail = string => string.match(/.+@.+\./)

// const TimeUnits = {
//   DAY: 24 * 60 * 60,
//   HOUR: 60 * 60,
//   MINUTE: 60
// }

export default class MockApi extends ApiInterface {
  /* Auth Endpoints */

  async getSelf () {
    return mockMe()
  }
  async login (email, password) {
    return isEmail(email)
      ? mock(genUser())
      : mock(null, false)
  }
  async logout () {
    return mock()
  }
  async forgotPassword (email) {
    return isEmail(email)
      ? mock()
      : mock(null, false)
  }
  async resetPassword (token, password) {
    return token === 'fail'
      ? mock(null, false)
      : mock(genUser())
  }

  /* Org Endpoints */

  async listOrgs () {
    return mockList(genOrg, 2)
  }
  async getOrg (orgId) {
    return orgId < 10
      ? mock(genOrg(parseInt(orgId)))
      : mock(null, false)
  }
  async inviteToOrg (orgId, firstName, lastName, email) {
    return firstName === 'fail'
      ? mock(null, false)
      : mock(true)
  }
  async listDeployments (orgId) {
    return mockList(genDeployment, 3, orgId)
  }
  async getDeployment (id) {
    return id < 10
      ? mock(genDeployment(id, 1))
      : mock(null, false)
  }
  async getDeploymentUsers (deploymentId) {
    return mockList(genUserDevice, 30, deploymentId)
  }
  async acceptOrgInvite (token, firstName, lastName, password) {
    return token === 'fail'
      ? mock(null, false)
      : mock(genUser())
  }
  async createDeployment (info, devices) {
    const id = store.state.deployments.length + 1
    return mock(Object.assign({ id }, info, { devices }))
  }
  async addDeviceToDeployment (deploymentId, deviceId) {
    return mock(genUserDevice(99))
  }
  async updateDeploymentUserDevice (deploymentId, deploymentUserId, deviceId) {
    return mock(true)
  }

  /* Challenge Endpoints */
  async getChallenges (deploymentId) {
    return mockList(genChallenge, 5, deploymentId)
  }
  async createChallenge (deploymentId, challenge) {
    const id = store.state.challenges.length + 1
    return challenge.name !== 'fail'
      ? mock({ ...genChallenge(id, deploymentId), ...challenge })
      : mock(null, false)
  }
  async editChallenge (challengeId, challenge) {
    let newChallenge = {
      ...genChallenge(challengeId, challenge.deploymentId),
      ...challenge
    }
    return challenge.name !== 'fail'
      ? mock(newChallenge)
      : mock(null, false)
  }
  async deleteChallenge (challengeId) {
    return mock({
      ...genChallenge(challengeId),
      deletedAt: new Date()
    })
  }

  /* Misc Endpoints */
  async availableDevices (organisationId) {
    return mockDeviceList(30)
  }
  async getStats () {
    return mock(genSiteStats())
  }

  /* Device Endpoints */
  async uploadDeviceData (deploymentId, deploymentUserId, deploymentDeviceId, payload) {
    return mock(true)
  }
  async getDeviceData (deploymentId, deploymentUserId, from, to, interval, format) {
    return mock(
      genStepsDataBetween(from, to, interval, format, deploymentUserId)
    )
  }

  /* Food Endpoint */
  async getFood (foodId) {
    return mock(genFood(foodId))
  }

  /* Question Endpoint */
  async getQuestion (questionId) {
    return mock(genQuestion(questionId))
  }

  async getAllQuestions () {
    return mock(genAllQuestions())
  }

  async logDeploymentUserState (deploymentUserId, state) {
    return mock(true)
  }

  async getDeploymentUserState (stateId) {
    // console.log('getting state...')
    return mock(genDeploymentUserState(stateId))
  }
}
