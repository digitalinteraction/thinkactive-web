/*
 * A mixin for components that have / load a Food from a url parameter
 * looks for an id using `$route.params.food_id`
 */
export default {
  computed: {
    foodId () {
      return parseInt(this.$route.params.food_id)
    },
    food () {
      return this.$store.getters.foodById(this.foodId)
    }
  }
}
