<template lang="pug">
.back-button-block
  .container
    router-link.button.is-text(:to="to")
      span.icon
        fa(icon="chevron-left")
      span Back
</template>

<script>
export default {
  props: {
    to: { type: [ Object, String ], required: true }
  }
}
</script>

<style lang="sass">

.back-button-block
  position: absolute
  left: 0
  right: 0

</style>
