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
import { date, Dark } from 'quasar'

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
				aspectRatio: 0.5,
				elements: {
					line: {
						tension: 0.1
					}
				},
				legend: {
					display: true,
					labels: {
						fontColor: Dark.isActive ? 'white' : 'black',
						fontSize: 16,
						padding: 16
					}
				},
				tooltips: {
					mode: 'point',
					intersect: false
				},
				scales: {
					xAxes: [{
						gridLines: {
							color: '#424242'
						},
						type: 'time',
						distribution: 'series',
						offset: true,
						bounds: 'data',
						time: {
							parser: 'MM DD YYYY',
							unit: 'day',
							round: 'day',
							tooltipFormat: 'll'
						},
						ticks: {
							fontColor: Dark.isActive ? 'white' : 'black',
							autoSkip: true
						}
					}],
					yAxes: [{
						display: true,
						gridLines: {
							color: '#424242'
						},
						scaleLabel: {
							display: true,
							labelString: 'Efforts',
							fontColor: Dark.isActive ? 'white' : 'black',
							fontSize: 14
						},
						ticks: {
							fontColor: Dark.isActive ? 'white' : 'black',
							autoSkip: true
						}
					}]
				}
			}
		}
	},
	async mounted () {
		const sprint = this.$store.getters['core/SPRINT_STARTED_BY_CURRENT_PROJECT']

		const sprintStartedAt = new Date(sprint.started_at)
		const sprintFinishedAt = new Date(sprint.finished_at)
		const diffDays = date
			.getDateDiff(sprintFinishedAt, sprintStartedAt, 'days')

		const totalSP = this.$store.getters['core/STORY_POINT_TOTAL_FOR_STARTED_SPRINT']
		const perDayDecrement = totalSP / diffDays

		const estimations = await this.$http
			.auth(true)
			.expect(200)
			.get(
				`/core/sprint-estimations/?sprint=${sprint.id}`
			)

		const daysLabels = []
		const expectedTimeValues = []
		const realTimeValues = []

		for (const datum of estimations.data) {
			realTimeValues.push({
				x: new Date(datum.point_at),
				y: datum.estimated_value
			})
		}

		for (let i = diffDays; i >= 0; i--) {
			const dayNumber = diffDays - i
			const _date = date.addToDate(sprintStartedAt, { days: dayNumber })
			const _value = Math.round(totalSP - perDayDecrement * dayNumber)
			expectedTimeValues.push({
				x: _date,
				y: _value
			})
		}

		this.chartdata = {
			labels: daysLabels,
			datasets: [
				{
					label: 'Estimated Effort',
					fill: false,
					pointRadius: 3,
					borderColor: 'rgba(255,255,255,0.85)',
					borderWidth: 3,
					data: expectedTimeValues,
					xAxisID: 'xAxis'
				},
				{
					label: 'Actual Effort',
					fill: false,
					pointRadius: 3,
					borderColor: '#4c8ef1',
					borderWidth: 3,
					data: realTimeValues,
					yAxisID: 'yAxis'
				}
			]
		}

		this.isLoaded = true
	}

})
</script>
<style>
.small_chart {
	width: 600px;
	height: 600px;
	max-height: 500px;
	max-width: 500px;
}
</style>
