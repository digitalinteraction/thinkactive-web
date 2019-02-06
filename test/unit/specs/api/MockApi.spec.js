import MockApi from '@/api/MockApi'
import { addApiConformanceTests } from '../../utils'

function itShouldSucceed (block) {
  it('should succeed', async () => {
    let { meta } = await block()
    expect(meta.success).toBe(true)
  })
}

describe('MockApi', () => {
  let api = new MockApi('/api')
  addApiConformanceTests(api)
  describe('#getSelf', () => {
    itShouldSucceed(() => api.getSelf())
    it('should return a User', async () => {
      let { data } = await api.getSelf()
      expect(data._mocktype).toBe('User')
    })
  })
  describe('#login', () => {
    itShouldSucceed(() => api.login('geoff@example.com', 'top_secret'))
    it('should fail if not an email', async () => {
      let { meta, data } = await api.login('geoff_t', 'top_secret')
      expect(meta.success).toBe(false)
      expect(data).toBe(null)
    })
    it('should return a User', async () => {
      let { data } = await api.login('geoff@example.com', 'top_secret')
      expect(data._mocktype).toBe('User')
    })
  })
  describe('#logout', () => {
    itShouldSucceed(() => api.logout())
  })
  describe('#forgotPassword', () => {
    itShouldSucceed(() => api.forgotPassword('geoff@example.com'))
    it('should fail if not an email', async () => {
      let { meta, data } = await api.forgotPassword('geoff_t')
      expect(meta.success).toBe(false)
      expect(data).toBe(null)
    })
  })
  describe('#resetPassword', () => {
    itShouldSucceed(() => api.resetPassword('some_token', 'new_secret'))
    it('should fail for a bad token', async () => {
      let { meta } = await api.resetPassword('fail', 'new_secret')
      expect(meta.success).toBe(false)
    })
  })
  
  describe('#listOrgs', () => {
    itShouldSucceed(() => api.listOrgs())
    it('should return 2 Organisations', async () => {
      let { data } = await api.listOrgs()
      expect(data).toBeInstanceOf(Array)
      data.forEach(item => {
        expect(item._mocktype).toBe('Org')
      })
    })
  })
  describe('#getOrg', () => {
    itShouldSucceed(() => api.getOrg(1))
    it('should return an Organisation', async () => {
      let { data } = await api.getOrg(1)
      expect(data._mocktype).toBe('Org')
    })
    it('should fail for ids over 10', async () => {
      let { meta } = await api.getOrg(10)
      expect(meta.success).toBe(false)
    })
  })
  describe('#listDeployments', () => {
    itShouldSucceed(() => api.listDeployments())
    it('should return 3 Deployments', async () => {
      let { data } = await api.listDeployments()
      expect(data).toBeInstanceOf(Array)
      expect(data).toHaveLength(3)
      data.forEach(item => {
        expect(item._mocktype).toBe('Deployment')
      })
    })
  })
  describe('#getDeployment', () => {
    itShouldSucceed(() => api.getDeployment(1))
    it('should return a Deployment', async () => {
      let { data } = await api.getDeployment(1)
      expect(data._mocktype).toBe('Deployment')
    })
    it('should fail for ids over 10', async () => {
      let { meta } = await api.getDeployment(10)
      expect(meta.success).toBe(false)
    })
  })
  describe('#getDeploymentUsers', () => {
    itShouldSucceed(() => api.getDeploymentUsers(1))
    it('should return 30 UserDevices', async () => {
      let { data } = await api.getDeploymentUsers(1)
      expect(data).toBeInstanceOf(Array)
      expect(data).toHaveLength(30)
      data.forEach(item => {
        expect(item._mocktype).toBe('UserDevice')
      })
    })
  })
  describe('#acceptOrgInvite', () => {
    const args = ['some_token', 'Geoff', 'Testington', 'new_secret']
    itShouldSucceed(() => api.acceptOrgInvite(...args))
    it('should return a User', async () => {
      let { data } = await api.acceptOrgInvite(...args)
      expect(data._mocktype).toBe('User')
    })
    it('should fail for a bad token', async () => {
      let { meta } = await api.acceptOrgInvite('fail')
      expect(meta.success).toBe(false)
    })
  })
  describe('#createDeployment', () => {
    const info = {}
    const devices = []
    itShouldSucceed(() => api.createDeployment(info, devices))
  })
  describe('#addDeviceToDeployment', () => {
    const deployment = {}
    const device = {}
    itShouldSucceed(() => api.addDeviceToDeployment(deployment, device))
    it('should return a UserDevice', async () => {
      let { data } = await api.addDeviceToDeployment(deployment, device)
      expect(data._mocktype).toBe('UserDevice')
    })
  })
  describe('#updateDeploymentUserDevice', () => {
    const args = [ 1, 2, 3 ]
    itShouldSucceed(() => api.updateDeploymentUserDevice(...args))
  })
  describe('#availableDevices', () => {
    itShouldSucceed(() => api.availableDevices())
    it('should return 30 devices', async () => {
      let { data } = await api.availableDevices()
      expect(data).toBeInstanceOf(Array)
      expect(data).toHaveLength(30)
      data.forEach(item => {
        expect(item._mocktype).toBe('Device')
      })
    })
  })
  describe('#getStats', () => {
    itShouldSucceed(() => api.getStats())
    it('should return stats', async () => {
      let { data } = await api.getStats()
      expect(data._mocktype).toBe('UsageStats')
    })
  })
  describe('#uploadDeviceData', () => {
    const stepData = [ ]
    itShouldSucceed(() => api.uploadDeviceData(1, 53, stepData))
  })
})
