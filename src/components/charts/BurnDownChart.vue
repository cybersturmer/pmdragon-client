<template>
	<q-card>
		<q-card-section class="column">
			<div class="small_chart col self-center">
				<LineChart
					v-if="isLoaded"
					:chartdata="chartdata"
					:options="options"/>
			</div>
		</q-card-section>
	</q-card>
</template>

<script>
import { defineComponent } from 'vue'
import LineChart from 'components/charts/LineChart'
import { getCssVar } from 'quasar'

export default defineComponent({
	name: 'BurnDownChart',
	components: {
		LineChart
	},
	data: () => {
		return {
			isLoaded: false,
			chartdata: [],
			options: {
				responsive: true,
				aspectRatio: 1.75,
				interaction: {
					intersect: false,
					mode: 'point'
				},
				plugins: {
					legend: {
						display: true,
						position: 'bottom',
						labels: {
							color: getCssVar('accent'),
							font: {
								size: 16
							},
							padding: 16
						}
					},
					tooltip: {
						enabled: true,
						footerColor: getCssVar('accent'),
						titleColor: getCssVar('accent')
					}
				},
				elements: {
					line: {
						tension: 0 // Smooth borders
					}
				},
				scales: {
					x: {
						display: true,
						type: 'time',
						time: {
							unit: 'day'
						},
						ticks: {
							padding: 10,
							color: getCssVar('accent')
						},
						grid: {
							color: getCssVar('info')
						}
					},
					y: {
						display: true,
						type: 'linear',
						ticks: {
							padding: 10,
							color: getCssVar('accent')
						},
						grid: {
							color: getCssVar('info')
						}
					}
				}
			}
		}
	},
	async mounted () {
		const sprint = this.$store.getters['core/SPRINT_STARTED_BY_CURRENT_PROJECT']

		const guideline = await this.$http
			.auth(true)
			.expect(200)
			.get(
				`/core/sprint-guideline/${sprint.id}`
			)

		const remaining = await this.$http
			.auth(true)
			.expect(200)
			.get(
				`/core/sprint-actual-efforts-history/?sprint=${sprint.id}`
			)

		const daysLabels = []
		const guidelineValues = []
		const remainingValues = []

		for (const datum of guideline.data) {
			guidelineValues.push({
				x: datum.time,
				y: datum.story_points
			})
		}

		for (const datum of remaining.data) {
			remainingValues.push({
				x: datum.point_at,
				y: datum.estimated_value
			})
		}

		this.chartdata = {
			labels: daysLabels,
			datasets: [
				{
					label: 'Guideline',
					fill: false,
					pointRadius: 4,
					pointStyle: 'circle',
					borderColor: getCssVar('primary'),
					backgroundColor: getCssVar('dark'),
					borderWidth: 3,
					spanGaps: true,
					data: guidelineValues
				},
				{
					label: 'Remaining Values',
					fill: false,
					pointRadius: 4,
					pointStyle: 'circle',
					borderColor: getCssVar('negative'),
					backgroundColor: getCssVar('dark'),
					borderWidth: 3,
					data: remainingValues
				}
			]
		}

		this.isLoaded = true
	}

})
</script>
