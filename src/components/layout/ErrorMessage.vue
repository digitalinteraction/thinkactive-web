<template lang="pug">
article.message.is-danger(v-if="value && value.length > 0")
  .message-header
    p {{title}}
    button.delete(v-if="!fixed", aria-label="delete", @click="hide")
  .message-body
    p(v-if="value.length == 1") {{value[0]}}
    ul(v-else)
      li(v-for="message in value") &bull; {{message}}
</template>

<script>

/* Events:

@input (value) -> When the messages change (to play nicely with v-model)
@reset ()      -> Only when the messages are reset (to seperate from v-model)

 */

export default {
  props: {
    title: { type: String, default: 'Error' },
    value: { type: Array, required: true },
    fixed: { type: Boolean, default: false }
  },
  methods: {
    hide () {
      this.$emit('input', [])
      this.$emit('reset')
    }
  }
}
</script>

<style lang="css">
</style>
