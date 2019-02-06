import ApiInterface from '@/api/ApiInterface'
import { addApiConformanceTests, ApiInterfaceSpec } from '../../utils'

describe('ApiInterface', () => {
  describe('constructor', function () {
    it('should store the base', async function () {
      let api = new ApiInterface('my_base')
      expect(api.base).toBe('my_base')
    })
    it('should remove trailing slashes', async function () {
      let api = new ApiInterface('my_base/')
      expect(api.base).toBe('my_base')
    })
  })
  
  let api = new ApiInterface('my_base')
  addApiConformanceTests(api)
  
  ApiInterfaceSpec.forEach(endpoint => {
    let [name, ...args] = endpoint
    describe(`#${name}`, function () {
      it(`should throw a 'Not Implemented' Error`, async () => {
        let error = null
        try {
          await api[name](...args)
        } catch (e) {
          error = e
        }
        expect(error).toBeDefined()
        expect(error.message).toBe('Not Implemented')
      })
    })
  })
})
