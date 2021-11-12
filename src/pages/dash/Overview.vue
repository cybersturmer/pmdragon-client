<template>
  <q-page class="flex q-layout-padding overflow-hidden">
    <div
      v-if="isActiveSprint"
      class="full-width text-center">
			<BlockHeader
				title="Burn Down Chart"
				class="q-py-none q-my-none"/>
			<BlockHeaderInfo
				:title="sprintTitle"
				:info="`${this.startedAt} - ${this.finishedAt}`"
				class="q-my-none q-py-none"/>
			<transition
				appear
				enter-active-class="animated fadeIn"
				leave-active-class="animated fadeOut">
				<BurnDownChart
					v-if="chartLoaded"
					ref="burnDownChart"/>
			</transition>
			<q-inner-loading :showing="chartLoading">
				<q-spinner-dots size="50px"/>
			</q-inner-loading>
    </div>
    <NoStartedSprintNotification v-else />
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import BurnDownChart from 'src/components/charts/BurnDownChart'
import BlockHeaderInfo from 'src/components/elements/BlockHeaderInfo'
import NoStartedSprintNotification from 'src/components/elements/NoStartedSprintNotification'

import { date, debounce } from 'quasar'
import { DATE_MASK } from 'src/services/masks'
import BlockHeader from 'src/components/elements/BlockHeader'
import { getSprintRemainingPreset, getSprintGuidelinePreset } from 'src/services/presets/core'
import { ErrorHandler } from 'src/services/util'

export default defineComponent({
	name: 'Overview',
	components: {
		BlockHeader,
		BlockHeaderInfo,
		BurnDownChart,
		NoStartedSprintNotification
	},
	data () {
		return {
			chartLoading: true
		}
	},
	async mounted () {
		await this.$nextTick(() => this.rebuild())
	},
	async updated () {
		await this.$nextTick(() => this.rebuild())
	},
	async created () {
		window.addEventListener(
			'resize',
			debounce(() => this.rebuild(), 300)
		)
	},
	async unmounted () {
		window.removeEventListener(
			'resize',
			debounce(() => this.rebuild(), 300)
		)
	},
	methods: {
		async rebuild () {
			this.chartLoading = true

			await this.getSprintRemaining()
			await this.getSprintGuideline()

			setTimeout(() => {
				this.chartLoading = false
			}, 100)
		},
		async getSprintRemaining () {
			try {
				const response = await this.$http
					.runMutablePreset(
						getSprintRemainingPreset,
						this.sprint.id
					)

				this.$store.commit('current/UPDATE_SPRINT_REMAINING', response.data)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async getSprintGuideline () {
			try {
				const response = await this.$http
					.runPreset({
						preset: getSprintGuidelinePreset,
						placeholder: this.sprint.id
					})

				this.$store.commit('current/UPDATE_SPRINT_GUIDELINE', response.data)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		}
	},
	computed: {
		chartLoaded () {
			return !this.chartLoading
		},
		isActiveSprint () {
			return !!this.$store.getters['core/SPRINT_STARTED_BUT_NOT_COMPLETED_BY_CURRENT_PROJECT']
		},
		sprint () {
			return this.$store.getters['core/SPRINT_STARTED_BY_CURRENT_PROJECT']
		},
		sprintTitle () {
			return this.sprint.title
		},
		startedAt () {
			try {
				return date.formatDate(this.sprint.started_at, DATE_MASK)
			} catch (e) {
				return null
			}
		},
		finishedAt () {
			try {
				return date.formatDate(this.sprint.finished_at, DATE_MASK)
			} catch (e) {
				return null
			}
		}
	}
})
</script>
