// import { shallow } from '@vue/test-utils'
import Vue from 'vue'
import ErrorMessage from '@/components/layout/ErrorMessage.vue'

describe('ErrorMessage.vue', () => {
  it.skip('should setup', async () => {
    const Constructor = Vue.extend(ErrorMessage)
    const vm = new Constructor().$mount()
    console.log(vm.$el)
    // let wrapper = shallow(ErrorMessage)
    // expect(wrapper.contains('.message-header'))
    //   .to.equal(true)
    // expect(wrapper.html()).to.exist
  })
})
