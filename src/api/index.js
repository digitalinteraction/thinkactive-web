import Vue from 'vue'
import LiveApi from './LiveApi'
import MockApi from './MockApi'
import { getConfig } from '../mixins/ConfigMixin'

const ApiType = getConfig('MOCK_API')
  ? MockApi
  : LiveApi

let api = new ApiType(getConfig('API_URL'))
Vue.use(api)

export default api
