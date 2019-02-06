<template lang="pug">
section.section.deploy-files-page
  .container
    h1.title Files
    h2.subtitle The documents for the deployment
    .buttons
      a.button.is-large.is-link(:href="cribLink", :download="cribFilename", target="_blank")
        .icon: fa(icon="download", size="sm")
        span Teacher Sheet
      a.button.is-large.is-link(:href="avatarBookletLabelsLink", :download="avatarBookletLabelsFilename", target="_blank")
        .icon: fa(icon="download", size="sm")
        span Booklet Stickers
      a.button.is-large.is-link(:href="basestationStickersLink", :download="basestationStickersFilename", target="_blank")
        .icon: fa(icon="download", size="sm")
        span Basestation Stickers
      a.button.is-large.is-link(:href="infoBookletStickersLink", :download="infoBookletStickersFilename", target="_blank")
        .icon: fa(icon="download", size="sm")
        span Info Booklet Stickers
</template>

<script>
import { OrgParamMixin, DeploymentParamMixin } from '@/mixins'

export default {
  mixins: [ OrgParamMixin, DeploymentParamMixin ],
  computed: {
    apiBase () {
      return `${this.$api.base}/deployments/${this.deployment.id}`
    },
    cribLink () {
      return `${this.apiBase}/files/cribsheet.pdf`
    },
    cribFilename () {
      return `${this.deployment.name} - Crib Sheet.pdf`
    },
    avatarBookletLabelsLink () {
      return `${this.apiBase}/files/avatarLabelSheet.pdf`
    },
    avatarBookletLabelsFilename () {
      return `avatarLabelSheet.pdf`
    },
    basestationStickersLink () {
      return `${this.apiBase}/files/chargingDockLabels.pdf`
    },
    basestationStickersFilename () {
      return `chargingDockLabels.pdf`
    },
    infoBookletStickersLink () {
      return `${this.apiBase}/files/infoBookletLabels.pdf`
    },
    infoBookletStickersFilename () {
      return `infoBookletLabels.pdf`
    }
  }
}
</script>

<style lang="css">
</style>
