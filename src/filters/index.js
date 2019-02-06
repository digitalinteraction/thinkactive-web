import Vue from 'vue'
import casex from 'casex'
import moment from 'moment-mini'

Vue.filter('userDeviceName', value => {
  if (typeof value !== 'object' || !value.animal || !value.colour) {
    return 'Unknown User'
  }
  return casex(value.colour, 'Case') + ' ' + casex(value.animal, 'Case')
})

Vue.filter('dateRange', ([from, to]) => {
  const format = date => moment(date).format('D MMM')
  return `${format(from)} → ${format(to)}`
})

Vue.filter('casex', (value, toCase) => {
  return casex(value, toCase)
})

Vue.filter('capitalize', value => {
  return casex(value.toLowerCase(), 'Ca se')
})

Vue.filter('number', value => {
  // ref - https://stackoverflow.com/a/2901298/1515924
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
})

// Vue.filter('casex', casex)
