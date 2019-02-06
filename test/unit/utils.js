export function checkNotImplemented (block) {
  it('should not be implemented', async function () {
    let failed = false
    try {
      await block()
      failed = true
    } catch (error) {
      failed = error.message !== 'Not Implemented'
    }
    if (failed) {
      expect.fail('Did not throw a "Not Implemented"')
    }
  })
}

export function checkCorrectArgs (endpoint, args) {
  it(`should have ${args.length || 'no'} arguments`, async () => {
    expect(endpoint).to.have.property('length', args.length)
  })
}

const orgId = 1
const deploymentId = 2
const deviceId = 3
const deploymentUserId = 4
const deploymentDeviceId = 5
const challengeId = 6

const inThePast = new Date()
const inTheFuture = new Date()

const uploadPayload = {
  recorded: inThePast,
  batteryLevel: 53,
  samples: [
    { steps: 100, batteryLevel: 53, recordedOn: new Date() }
  ]
}

export const ApiInterfaceSpec = [
  [ 'getSelf' ],
  [ 'login', 'me@example.com', 'top_secret' ],
  [ 'logout' ],
  [ 'forgotPassword', 'me@example.com' ],
  [ 'resetPassword', 'some_token', 'new_secret' ],

  [ 'listOrgs' ],
  [ 'getOrg', orgId ],
  [ 'inviteToOrg', orgId, 'firstName', 'lastName', 'email' ],
  [ 'listDeployments', orgId ],
  [ 'getDeployment', deploymentId ],
  [ 'getDeploymentUsers', deploymentId ],
  [ 'acceptOrgInvite', 'some_token', 'Geoff', 'Testington', 'new_secret' ],
  [ 'createDeployment', {}, [] ],
  [ 'addDeviceToDeployment', deploymentId, deviceId ],
  [ 'updateDeploymentUserDevice', deploymentId, deploymentUserId, deviceId ],
  
  [ 'getChallenges', deploymentId ],
  [ 'createChallenge', deploymentId, {} ],
  [ 'editChallenge', challengeId, {} ],
  [ 'deleteChallenge', challengeId ],

  [ 'availableDevices', orgId ],
  [ 'getStats' ],
  
  [ 'uploadDeviceData', deploymentId, deploymentUserId, deploymentDeviceId, uploadPayload ],
  [ 'getDeviceData', deploymentId, deploymentUserId, inThePast, inTheFuture, 1000, 'MINUTES' ]
]

export function addApiConformanceTests (api) {
  describe(`<ApiInterface>`, function () {
    ApiInterfaceSpec.forEach(endpoint => {
      let [name, ...args] = endpoint
      it(`should implement #${name} with ${args.length || 'no'} args`, async () => {
        expect(api[name]).toBeInstanceOf(Function)
        expect(api[name]).toHaveLength(args.length)
      })
    })
  })
}
