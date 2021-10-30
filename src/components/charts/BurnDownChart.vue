<template>
	<q-card>
		<q-card-section class="column">
			<div class="small_chart col self-center">
				<LineChart
					ref="lineChart"
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

const passivePoint = (ctx, decision) => ctx.p0.parsed.y === ctx.p1.parsed.y ? decision.yes : decision.no

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
					intersect: true,
					mode: 'nearest'
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
						offset: true,
						type: 'timeseries',
						time: {
							unit: 'day',
							minUnit: 'hour',
							round: 'day'
						},
						ticks: {
							minRotation: 90,
							maxRotation: 90,
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
	computed: {
		sprint () {
			return this.$store.getters['core/SPRINT_STARTED_BY_CURRENT_PROJECT']
		},
		sprintRemainingTimeseries () {
			return this.$store.getters['current/SPRINT_REMAINING_TIMESERIES']
		},
		sprintGuidelineTimeseries () {
			return this.$store.getters['current/SPRINT_GUIDELINE_TIMESERIES']
		}
	},
	async mounted () {
		const daysLabels = []

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
					borderDash: [6, 2],
					segment: {
						borderWidth: ctx => passivePoint(ctx, {
							yes: 1,
							no: 3
						}),
						borderColor: ctx => passivePoint(ctx, {
							yes: getCssVar('secondary'),
							no: getCssVar('primary')
						})
					},
					data: this.sprintGuidelineTimeseries
				},
				{
					label: 'Remaining Values',
					fill: false,
					pointRadius: 4,
					pointStyle: 'circle',
					borderColor: getCssVar('negative'),
					backgroundColor: getCssVar('dark'),
					borderWidth: 3,
					data: this.sprintRemainingTimeseries
				}
			]
		}

		this.isLoaded = true
	}

})
</script>
