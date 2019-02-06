import { ROUTES, MUTATIONS } from '@/constants'

/*
 * @vue/component
 * A mixin for authentication logic
 * and committing a login with a given user and redirect link
 */
export default {
  data () {
    return { checkingLogin: false, loggingOut: false, loggingIn: false }
  },
  methods: {
    async checkLogin (redirect = null) {
      this.checkingLogin = true
      let { data } = await this.$api.getSelf()
      if (data) {
        this.$store.commit(MUTATIONS.LOGGED_IN, data)
        if (redirect) this.$router.push(redirect)
      }
      this.checkingLogin = false
    },
    async performLogin (email, password) {
      this.loggingIn = true
      let { meta, data } = await this.$api.login(email, password)
      this.performingLogin = true
      if (meta.success) this.commitLogin(data)
      this.loggingIn = false
      return meta.success
    },
    async performLogout (dest = null) {
      this.loggingOut = true
      await this.$api.logout()
      this.$store.commit(MUTATIONS.LOGGED_OUT)
      this.loggingOut = false
      this.$router.push({ name: dest || ROUTES.HOME })
    },
    commitLogin (user, dest = null) {
      this.$store.commit(MUTATIONS.LOGGED_IN, user)
      this.$router.push(dest || { name: ROUTES.DASH_HOME })
    }
  }
}
