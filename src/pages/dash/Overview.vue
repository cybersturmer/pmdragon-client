<template>
  <q-page class="q-pa-lg">
    <q-circular-progress
      show-value
      size="50px"
      min="0"
      max="100"
      :value="sprintDonePercentage"
      center-color="primary"
      color="accent">
      {{ sprintDonePercentage }}%
    </q-circular-progress>
  </q-page>
</template>

<script>
export default {
  name: 'Overview',
  computed: {
    sprintDonePercentage () {
      const totalSP = this.$store.getters['issues/STORY_POINT_TOTAL_FOR_STARTED_SPRINT']
      const currentSPDone = this.$store.getters['issues/STORY_POINT_DONE_FOR_STARTED_SPRINT']
      return Math.round(currentSPDone / totalSP * 100)
    }
  }
}
</script>

<style scoped>

</style>
