import { MOCK } from '@/constants'
import {
  genEnvelope, genUser, genDeployment, genDevice, genUserDevice, genOrg
} from './generator'

/*
 * Utilities to generate api responses and mock their http transport
 * Uses some constants:
 * - MOCK.SPEED > How fast the mock connection should be
 * - MOCK.SHOULD_FAIL > If api requests should fail or not
 * - MOCK.LOGGED_IN > If the user is already logged into the api (ignores MOCK.SHOULD_FAIL)
 */

/** Mock the wait for a connection */
export async function mockConnection () {
  await new Promise(resolve => setTimeout(resolve, MOCK.SPEED))
}

/** Mock the returning of a payload over a network */
export async function mock (payload = null, success = true) {
  await mockConnection()
  return genEnvelope(
    success && !MOCK.SHOULD_FAIL,
    MOCK.SHOULD_FAIL ? null : payload
  )
}

/** Mock the returning of a list of n models, the last params are passed to the generator after the id */
export function mockList (generator, n, ...args) {
  let models = []
  for (let i = 1; i <= n; i++) {
    models.push(generator(i, ...args))
  }
  return mock(models)
}

/** Mock the 'me' endpoint, returning a user depending on MOCK.LOGGED_IN */
export async function mockMe () {
  await mockConnection()
  let user = MOCK.LOGGED_IN ? genUser() : null
  return genEnvelope(true, user)
}

/** Mock a set of n organisations */
export function mockOrgList (n) {
  let orgs = []
  for (let i = 1; i <= n; i++) {
    orgs.push(genOrg(i))
  }
  return mock(orgs)
}

/** Mock a list of deployments returned over a network */
export function mockDeploymentList (n, orgId) {
  let deployments = []
  for (let i = 1; i <= n; i++) {
    deployments.push(genDeployment(i, orgId))
  }
  return mock(deployments)
}

/** Mock a set of n devices from an endpoint */
export function mockDeviceList (n) {
  let devices = []
  for (let i = 0; i < n; i++) {
    devices.push(genDevice())
  }
  return mock(devices)
}

/** Mock a set of n user_devices from an endpoint */
export function mockUserDeviceList (n, deploymentId) {
  let userDevices = []
  for (let i = 0; i < n; i++) {
    userDevices.push(genUserDevice(i + 1, deploymentId))
  }
  return mock(userDevices)
}
