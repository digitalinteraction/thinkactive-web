import LiveApi from '@/api/LiveApi'
import { addApiConformanceTests } from '../../utils'

describe('LiveApi', () => {
  let api = new LiveApi('/api')
  addApiConformanceTests(api)
})
