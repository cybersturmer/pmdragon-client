<template>
  <q-page class="flex q-layout-padding overflow-hidden">
    <div
      v-if="IsSprintStartedButNotCompleted"
      class="full-width text-center">
      <q-circular-progress
        show-value
        size="50px"
        :min="0"
        :max="100"
        :value="sprintDonePercentage"
        center-color="primary"
        color="accent">
        {{ sprintDonePercentage }}%
      </q-circular-progress>
      <span class="q-ml-md text-h5">Sprint: {{ sprintTitle }}</span>
      <p class="text-h6 text-amber">{{ this.startedAt }} - {{ this.finishedAt }}</p>
      <q-separator class="q-mt-md"/>
      <BurnDownChart/>
    </div>
    <NoStartedSprintNotification v-else />
  </q-page>
</template>

<script>
import BurnDownChart from 'components/charts/BurnDownChart.vue'
import NoStartedSprintNotification from 'components/elements/NoStartedSprintNotification.vue'
import { date } from 'quasar'
import { DATE_MASK } from 'src/services/masks'

export default {
  name: 'Overview',
  components: { BurnDownChart, NoStartedSprintNotification },
  computed: {
    IsSprintStartedButNotCompleted () {
      return !!this.$store.getters['core/SPRINT_STARTED_BUT_NOT_COMPLETED_BY_CURRENT_PROJECT']
    },
    sprintDonePercentage () {
      try {
        const totalSP = this.$store.getters['core/STORY_POINT_TOTAL_FOR_STARTED_SPRINT']
        if (totalSP === 0) return 0

        const currentSPDone = this.$store.getters['core/STORY_POINT_DONE_FOR_STARTED_SPRINT']
        return Math.round(currentSPDone / totalSP * 100)
      } catch (e) {
        return 0
      }
    },
    sprintTitle () {
      try {
        const title = this.$store.getters['core/SPRINT_STARTED_BY_CURRENT_PROJECT'].title
        return `"${title}"`
      } catch (e) {
        return ''
      }
    },
    startedAt () {
      try {
        const sprint = this.$store.getters['core/SPRINT_STARTED_BY_CURRENT_PROJECT']
        return date.formatDate(sprint.started_at, DATE_MASK)
      } catch (e) {
        return null
      }
    },
    finishedAt () {
      try {
        const sprint = this.$store.getters['core/SPRINT_STARTED_BY_CURRENT_PROJECT']
        return date.formatDate(sprint.finished_at, DATE_MASK)
      } catch (e) {
        return null
      }
    }
  }
}
</script>
