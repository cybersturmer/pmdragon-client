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
			guideline: [],
			remaining: [],
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
						type: 'time',
						time: {
							unit: 'day'
						},
						ticks: {
							autoSkip: false,
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

		const responseGuideline = await this.$http
			.auth(true)
			.expect(200)
			.get(
				`/core/sprint-guideline/${sprint.id}`
			)

		this.guideline = responseGuideline.data

		const responseRemaining = await this.$http
			.auth(true)
			.expect(200)
			.get(
				`/core/sprint-efforts-history/?sprint=${sprint.id}`
			)

		this.remaining = responseRemaining.data

		const daysLabels = []
		const guidelineValues = []
		const remainingValues = []

		for (const datum of this.guideline) {
			guidelineValues.push({
				x: datum.time,
				y: datum.story_points,
				z: datum.is_working
			})
		}

		for (const datum of this.remaining) {
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
