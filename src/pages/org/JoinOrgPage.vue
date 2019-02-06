<template lang="pug">
.join-org-page
  hero.is-primary
    .container
      h1.title Join Organisation
      h2.subtitle You have been invited to an organisation, enter your details below to join it
  section.section
    .container
      half-width
        h1.title Your Information
        join-org-form()
</template>

<script>
import Hero from '@/components/layout/Hero'
import JoinOrgForm from '@/components/form/JoinOrgForm'
import HalfWidth from '@/components/layout/HalfWidth'

export default {
  components: { Hero, JoinOrgForm, HalfWidth }
}
</script>

<style>
</style>
