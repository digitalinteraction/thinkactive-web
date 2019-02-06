import 'babel-polyfill'

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './api'
import './native'
import './filters'

import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import fontawesome from '@fortawesome/fontawesome'
import solidIcons from '@fortawesome/fontawesome-free-solid'
import regularIcons from '@fortawesome/fontawesome-free-regular'

import WebFont from 'webfontloader'

import VTooltip from 'v-tooltip'

fontawesome.library.add(solidIcons, regularIcons)
Vue.component('fa', FontAwesomeIcon)

Vue.use(VTooltip, {
  defaultTrigger: 'click',
  defaultHideOnTargetClick: true,
  autoHide: true,
  popover: {
    defaultAutoHide: true
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

WebFont.load({ google: { families: [ 'Lato:400,600' ] } })
