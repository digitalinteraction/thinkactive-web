<template lang="pug">
.splash-message(:class="classes")
  .container
    span.splash-body(v-if="activeMessage")
      span.icon.is-large(v-if="activeIcon")
        fa(:icon="activeIcon")
      span {{activeMessage.body}}
</template>

<script>
import { SplashMessageBus } from '@/busses'
import { EventsMixin, TimersMixin } from '@/mixins'

const IconMap = {
  success: 'check-circle',
  warning: 'exclamation-circle',
  info: 'info-circle',
  danger: 'times-circle'
}

const DefaultTimeout = 5000

export default {
  mixins: [ EventsMixin, TimersMixin ],
  data: () => ({
    messageQueue: []
  }),
  computed: {
    activeMessage () {
      return this.messageQueue[0]
    },
    activeIcon () {
      if (!this.activeMessage) return null
      return IconMap[this.activeMessage.type] || null
    },
    classes () {
      let type = this.activeMessage ? this.activeMessage.type : 'success'
      return {
        'is-active': this.activeMessage,
        [`is-${type}`]: true
      }
    },
    styles () {
      return {
        'height': this.activeMessage ? '64px' : '0'
      }
    }
  },
  mounted () {
    this.listenFor('message', this.onMessage, SplashMessageBus)
  },
  methods: {
    onMessage ({ body, type, length = DefaultTimeout }) {
      this.messageQueue.push({ body, type, length })
      
      // If the first message, start a timeout to hide it
      if (this.messageQueue.length === 1) {
        this.addTimeout(length, () => this.pollQueue())
      }
    },
    pollQueue () {
      if (this.messageQueue.length < 0) return
      this.messageQueue.shift()
      
      // If there are more messages, add a timer to remove the next one
      if (this.messageQueue.length > 0) {
        let length = this.messageQueue[0].length
        this.addTimeout(length, () => this.pollQueue())
      }
    }
  }
}
</script>

<style lang="sass">
.splash-message
  transition-property: height, background-color, border-color, border-width, line-height
  transition-duration: 0.3s
  
  border-bottom: 0px solid transparent
  height: 0
  line-height: 0
  
  &.is-active
    height: 64px
    line-height: 64px
    
    @each $name, $pair in $colors
      &.is-#{$name}
        background-color: nth($pair, 1)
        border-bottom: 3px solid darken(nth($pair, 1), 5%)
        color: nth($pair, 2)
  
  .splash-body
    font-size: 22px
    display: inline-flex
    align-items: center
    
    .icon
      margin-right: 0.1em
      font-size: 1.7em

</style>
