<template lang="pug">
#app
  loading(v-if="checkingLogin", title="Checking Login")
  router-view(v-else)
</template>

<script>
import AuthMixin from '@/mixins/AuthMixin'

import Loading from '@/components/layout/Loading'

export default {
  components: { Loading },
  mixins: [ AuthMixin ],
  created () {
    this.checkLogin()
  }
}
</script>

<style lang="sass">

@import ~bulma/bulma
@import ~sass/common

</style>
