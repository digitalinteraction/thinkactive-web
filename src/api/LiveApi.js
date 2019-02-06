import ApiInterface from './ApiInterface'
import Axios from 'axios'

// TODO: Kick out users at a 401 ~ redirect to /

/** An implementation of ApiInterface that talks to an actual API */
export default class Api extends ApiInterface {
  constructor (base) {
    super(base)
    this.agent = Axios.create({
      baseURL: this.base,
      withCredentials: true
    })
  }
  
  /** A custom notImplemented for live usage */
  notImplemented () {
    return this.makeEnvelope(false, null, [ 'Not Implemented' ])
  }
  
  async endpoint (method, url, body = {}, query = {}) {
    try {
      url = this.sanitizeUrl(url)
      let res = await this.agent.request({
        method, url, params: query, data: body
      })
      let { data, meta } = res.data
      return this.makeEnvelope(true, data, meta.messages)
    } catch (error) {
      if (error.response) {
        let envelope = error.response.data || {}
        return this.makeEnvelope(false, null, envelope.meta && envelope.meta.messages)
      } else {
        return this.makeEnvelope(false, null, [ 'Something went wrong' ])
      }
    }
  }
  sanitizeUrl (url) {
    return url.replace(/\/?$/, '/') // Ensure a trailing slash
  }
  
  /*
   * Authentication Endpoints
   */
  
  async getSelf () {
    return this.endpoint('get', '/auth/me')
  }
  async login (email, password) {
    return this.endpoint('post', '/auth/login', { email, password })
  }
  async logout () {
    return this.endpoint('post', '/auth/logout')
  }
  async forgotPassword (email) {
    return this.endpoint('post', '/auth/forgot', { email })
  }
  async resetPassword (token, password) {
    return this.endpoint('post', '/auth/reset', { token, password })
  }
  
  /*
   * Organisation Endpoints
   */
  async listOrgs () {
    return this.endpoint('get', `/organisations`)
  }
  async getOrg (id) {
    return this.endpoint('get', `/organisations/${id}`)
  }
  async inviteToOrg (orgId, firstName, lastName, email) {
    return this.endpoint(
      'post',
      `/organisations/${orgId}/invite`,
      { firstName, lastName, email }
    )
  }
  async listDeployments (id) {
    return this.endpoint('get', `/deployments`)
  }
  async getDeployment (id) {
    return this.endpoint('get', `/deployments/${id}`)
  }
  async getDeploymentUsers (id) {
    return this.endpoint('get', `/deployments/${id}/users`)
  }
  async acceptOrgInvite (code, firstName, lastName, password) {
    return this.endpoint('post', `/organisations/join`, {
      code, firstName, lastName, password
    })
  }
  async createDeployment (info, devices) {
    return this.endpoint('post', `/deployments`, {
      ...info, devices
    })
  }
  async addDeviceToDeployment (deploymentId, deviceId) {
    return this.notImplemented()
    // return this.endpoint('post', `/deployments/${deploymentId}/users`, { deviceId })
  }
  async updateDeploymentUserDevice (deploymentId, deploymentUserId, deviceId) {
    // return this.endpoint('post', `/deployments/${deploymentId}/users`)
    return this.notImplemented()
  }
  
  /*
   * Challenge Endpoints
   */
  async getChallenges (deploymentId) {
    return this.endpoint('get', `/deployments/${deploymentId}/challenges`)
  }
  async createChallenge (deploymentId, challenge) {
    return this.endpoint('post', `/deployments/${deploymentId}/challenges`, challenge)
  }
  async editChallenge (challengeId, challenge) {
    return this.endpoint(
      'put',
      `/deployments/${challenge.deploymentId}/challenges/${challengeId}`,
      challenge
    )
  }
  // async deleteChallenge (challengeId) {
  //   // ...
  // }
  
  /*
   * Misc Endpoints
   */
  async availableDevices (id) {
    return this.endpoint('get', `/organisations/${id}/devices`)
  }

  /* Food Endpoint */
  async getFood (id) {
    return this.endpoint('get', `/food/${id}`)
  }

  /* Question Endpoint */
  async getQuestion (questionId) {
    return this.endpoint('get', `/questions/${questionId}`)
  }

  async getAllQuestions () {
    return this.endpoint('get', `/questions/all`)
  }

  /* State Endpoints */
  async logDeploymentUserState (deploymentUserId, state) {
    return this.endpoint(
      'post',
      `/deploymentUserState`,
      { deploymentUserId, ...state }
    )
  }

  async getDeploymentUserState (deploymentUserId) {
    return this.endpoint('get', `/deploymentUserState/${deploymentUserId}`)
  }
  
  async uploadDeviceData (deploymentId, deploymentUserId, deploymentDeviceId, payload) {
    return this.endpoint(
      'post',
      `/deployments/${deploymentId}/device/${deploymentDeviceId}/data`,
      { deploymentUserId, ...payload }
    )
  }
  
  async getDeviceData (deploymentId, deploymentUserIds, from, to, interval, intervalUnit) {
    return this.endpoint('get', `/deployments/${deploymentId}/data`, {}, {
      deploymentUserIds: deploymentUserIds.join(','),
      from,
      to,
      interval,
      intervalUnit
    })
  }
}

// NOTE: Expecting the methods to ALWAYS return a { meta, data } even when the api request fails
