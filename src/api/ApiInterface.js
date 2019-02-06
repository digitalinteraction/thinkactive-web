/** An interface for interacting with the ThinkActive api */
export default class ApiInterface {
  /** Creates a new Api */
  constructor (base = '/api') {
    this.base = base.replace(/\/$/, '')
  }
  /** Installs the api onto Vue */
  install (Vue) {
    Vue.prototype.$api = this
  }
  /** Throws a 'Not Implemented' error */
  notImplemented () {
    throw new Error('Not Implemented')
  }

  /** Makes an api response envelope */
  makeEnvelope (success, payload = null, messages = []) {
    return {
      meta: { success, messages },
      data: payload
    }
  }

  /* Auth Endpoints */
  async getSelf () {
    this.notImplemented()
  }
  async login (email, password) {
    this.notImplemented()
  }
  async logout () {
    this.notImplemented()
  }
  async forgotPassword (email) {
    this.notImplemented()
  }
  async resetPassword (token, password) {
    this.notImplemented()
  }

  /* Org Endpoints */
  async listOrgs () {
    this.notImplemented()
  }
  async getOrg (id) {
    this.notImplemented()
  }
  async inviteToOrg (orgId, firstName, lastName, email) {
    this.notImplemented()
  }
  async listDeployments (id) {
    this.notImplemented()
  }
  async getDeployment (id) {
    this.notImplemented()
  }
  async getDeploymentUsers (id) {
    this.notImplemented()
  }
  async acceptOrgInvite (token, firstName, lastName, password) {
    this.notImplemented()
  }
  async createDeployment (info, devices) {
    this.notImplemented()
  }

  async addDeviceToDeployment (deploymentId, deviceId) {
    this.notImplemented()
  }
  async updateDeploymentUserDevice (deploymentId, deploymentUserId, deviceId) {
    this.notImplemented()
  }
  
  /* Challenge Endpoints */
  async getChallenges (deploymentId) {
    this.notImplemented()
  }
  async createChallenge (deploymentId, challenge) {
    this.notImplemented()
  }
  async editChallenge (challengeId, challenge) {
    this.notImplemented()
  }
  async deleteChallenge (challengeId) {
    this.notImplemented()
  }
  
  /* Misc Endpoints */
  async availableDevices (organisationId) {
    this.notImplemented()
  }
  async getStats () {
    this.notImplemented()
  }

  /* Food Endpoints */
  async getFood (foodId) {
    this.notImplemented()
  }

  /* Question Endpoints */
  async getQuestion (questionId) {
    this.notImplemented()
  }

  async getAllQuestions () {
    this.notImplemented()
  }

  /* Device Endpoints */
  async uploadDeviceData (deploymentId, deploymentUserId, deploymentDeviceId, payload) {
    this.notImplemented()
  }
  async getDeviceData (deploymentId, deploymentUserId, from, to, interval, format) {
    this.notImplemented()
  }

  /* State Endpoints */
  async logDeploymentUserState (deploymentUserId, state) {
    this.notImplemented()
  }

  async getDeploymentUserState (deploymentUserId) {
    this.notImplemented()
  }
  // ...
}

/* EXPECTED ENDPOINTS:

✓ GET  /auth/me () -> User
✓ POST /auth/login (email, password) -> User
✓ POST /auth/logout () -> Void
✓ POST /auth/forgot (email) -> Void
✓ POST /auth/reset (token, newPassword) -> User

✓ GET  /orgs () -> Org[]
✓ GET  /orgs/:id () -> Org
✓ GET  /deployments () -> Deployment[]
✓ GET  /deployment/:id () -> Deployment
✓ GET  /deployment/:id/users () -> UserDevice[]
✓ POST /org/join (code, firstName, lastName, password) -> User
✓ POST /org/:id/invite (email) -> Boolean
POST /deployment (Deployment, devices) -> Deployment

✓ POST /deployment/:id (device_id) -> UserDevice
POST /deployment/:id/user/:id/update (device_id) -> Boolean

GET /deployment/:id/files/cribsheet.pdf -> <raw_file>
GET /deployment/:id/files/userlist.pdf -> <raw_file>

GET  /devices/available () -> Device[]
GET /stats -> Stats

*** Phils Additions ***
GET /food/:id -> Food
GET /question/:id -> Question
GET /questions -> Question[]

GET /deployment/:id/user/:id/activeState -> State
POST /deployment/:id/user/:id/state -> Boolean

*/

/* EXPECTED TYPES:

User: { firstName, lastName, email }
Deployment: { name, location, poc, org_id, baselineFrom, baselineTo, activityFrom, activityTo }
Org: { name }
Device: { macAddress }
UserDevice: { name, macAddress }
Stats: { steps, users, deployments, instructors }

*** Phil's Additions ***

Food: { id, name, group, energy, fat, sugar } -- should already be defined in backend
Question: { id, level, text, questionFoodGroup: [ 1, 1, 1, 0, 1 ], questionState: [ 0, 0, 1, 0, 1, 0 ], answerType, answerReq, answerContents, resultFoodGroup: [ 1, 1, 1, 1, 1 ], resultState: [ 1, 1, 1, 1, 1, 1 ] }  -- should already be defined in backend
State: { id, deploymentUserId, questionId, attemptNumber, answeredCorrectly, active }

User >-< Org
Org  --< Deployment

 */
