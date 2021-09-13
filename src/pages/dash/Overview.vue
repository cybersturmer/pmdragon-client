<template>
  <q-page class="flex q-layout-padding overflow-hidden">
    <div
      v-if="IsSprintStartedButNotCompleted"
      class="full-width text-center">
			<BlockHeader
				title="Burn Down Chart"
				class="q-py-none q-my-none"/>
			<BlockHeaderInfo
				:title="sprintTitle"
				:info="`${this.startedAt} - ${this.finishedAt}`"
				class="q-my-none q-py-none"/>
      <BurnDownChart/>
    </div>
    <NoStartedSprintNotification v-else />
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import BurnDownChart from 'src/components/charts/BurnDownChart'
import BlockHeaderInfo from 'src/components/elements/BlockHeaderInfo'
import NoStartedSprintNotification from 'src/components/elements/NoStartedSprintNotification'

import { date } from 'quasar'
import { DATE_MASK } from 'src/services/masks'
import BlockHeader from 'src/components/elements/BlockHeader'

export default defineComponent({
	name: 'Overview',
	components: {
		BlockHeader,
		BlockHeaderInfo,
		BurnDownChart,
		NoStartedSprintNotification
	},
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
				return this.$store.getters['core/SPRINT_STARTED_BY_CURRENT_PROJECT'].title
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
})
</script>
