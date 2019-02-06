<template lang="pug">
g.svg-avatar(:transform="transform")
  g.wrapper(ref="wrapper")
    device-avatar(:deployment-user="deploymentUser")
</template>

<script>
import { styler, spring, listen, pointer, value, transform } from 'popmotion'
import { PopmotionMixin } from '@/mixins'
import DeviceAvatar from './DeviceAvatar'

const { interpolate, transformMap } = transform

const clampToFraction = v => Math.max(0, Math.min(1, v))

export default {
  components: { DeviceAvatar },
  mixins: [ PopmotionMixin ],
  props: {
    deploymentUser: { type: Object, required: true },
    numDeploymentUsers: { type: Number, required: true },
    index: { type: Number, required: true }
  },
  data: () => ({
    justPlaced: true
  }),
  computed: {
    transform () {
      return `${this.positionTransform} ${this.scaleTransform}`
    },
    positionTransform () {
      let angle = Math.PI - (2 * Math.PI * this.index / this.numDeploymentUsers)
      let length = this.justPlaced ? 10 : 40
      if (this.deploymentUser.state === 'leaving') length = 60
      let x = length * Math.sin(angle)
      let y = length * Math.cos(angle)
      return `translate(${x}, ${y})`
    },
    scaleTransform () {
      if (this.deploymentUser.state === 'leaving') return `scale(0)`
      let factor = 1 - clampToFraction((this.numDeploymentUsers - 8) / 15)
      return `scale(${this.justPlaced ? '0' : 0.4 + (factor * 0.6)})`
    }
  },
  mounted () {
    setTimeout(() => { this.justPlaced = false }, 100)
    
    const divStyler = styler(this.$refs.wrapper)
    const ballXY = value({ x: 0, y: 0 }, divStyler.set)
    
    const size = window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight
    const halfSize = size * 0.5
    const scale = interpolate([-halfSize, halfSize], [-50, 50])
    const scaleXY = transformMap({ x: scale, y: scale })
    
    let e1 = listen(this.$refs.wrapper, 'mousedown touchstart')
      .start((e) => {
        e.preventDefault()
        pointer(ballXY.get())
          .pipe(scaleXY)
          .start(ballXY)
      })
    
    let e2 = listen(document, 'mouseup touchend')
      .start(() => {
        spring({
          from: ballXY.get(),
          velocity: ballXY.getVelocity(),
          to: { x: 0, y: 0 },
          stiffness: 300
        }).start(ballXY)
      })
    
    this.pushPopEvent(e1, e2)
  }
}
</script>

<style lang="sass">
.svg-avatar
  transition: transform 0.2s linear
</style>
