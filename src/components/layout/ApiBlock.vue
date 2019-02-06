<template lang="pug">
error-message(v-if="meta && messages.length > 0", v-model="messages", fixed)
loading(v-else-if="inProgress", :title="loading")
div(v-else-if="meta")
  slot(:data="data")
</template>

<script>

/* Events:

@input () -> When a response from the api call is ready (i.e. for v-model)

*/

import ErrorMessage from '@/components/layout/ErrorMessage'
import Loading from '@/components/layout/Loading'

export default {
  components: { ErrorMessage, Loading },
  props: {
    endpoint: {
      type: Function,
      required: true
    },
    loading: { type: String, required: true },
    value: { type: [ Boolean, Number, String, Array, Object ], default: null }
  },
  data () {
    return {
      messages: [],
      inProgress: false,
      meta: null,
      data: null
    }
  },
  mounted () {
    if (this.endpoint && !this.value && !this.inProgress) {
      this.performEndpoint()
    }
  },
  methods: {
    refresh () {
      this.$emit('input', null)
      this.performEndpoint()
    },
    async performEndpoint () {
      this.messages = []
      this.inProgress = true
      let res = await this.endpoint()
      this.$emit('input', res.data)
      this.meta = res.meta
      this.data = res.data
      this.inProgress = false
    }
  }
}
</script>

<style lang="css">
</style>
