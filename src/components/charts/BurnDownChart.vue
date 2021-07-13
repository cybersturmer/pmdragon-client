<template>
  <q-card
    class="bg-primary"
    style="border: 1px solid #606060;"
  >
    <q-card-section>
      <div class="small_chart">
      <LineChart
        v-if="isLoaded"
        :chartdata="chartdata"
        :options="options"
      />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import LineChart from 'components/charts/LineChart.vue'
import { date } from 'quasar'
import { Api } from 'src/services/api'

export default {
	name: 'BurnDownChart',
	components: {
		LineChart
	},
	data: () => ({
		isLoaded: false,
		chartdata: null,
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
					fontColor: 'rgba(255,255,255,0.85)',
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
						fontColor: 'white',
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
						fontColor: 'rgba(255,255,255,0.85)',
						fontSize: 14
					},
					ticks: {
						fontColor: 'white',
						autoSkip: true
					}
				}]
			}
		}
	}),
	async mounted () {
		this.isLoaded = false
		const sprint = this.$store.getters['core/SPRINT_STARTED_BY_CURRENT_PROJECT']

		const sprintStartedAt = new Date(sprint.started_at)
		const sprintFinishedAt = new Date(sprint.finished_at)
		const diffDays = date
			.getDateDiff(sprintFinishedAt, sprintStartedAt, 'days')

		const totalValue = this.$store.getters['core/STORY_POINT_TOTAL_FOR_STARTED_SPRINT']
		const perDayDecrement = totalValue / diffDays

		const estimations = await new Api({
			auth: true,
			expectedStatus: 200
		})
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
			const _value = Math.round(totalValue - perDayDecrement * dayNumber)
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
					data: expectedTimeValues
				},
				{
					label: 'Actual Effort',
					fill: false,
					pointRadius: 3,
					borderColor: '#4c8ef1',
					borderWidth: 3,
					data: realTimeValues
				}
			]
		}

		this.isLoaded = true
	}
}
</script>

<style>
  .small_chart {
    position: relative;
    max-width: 700px;
    margin: 0 auto;
  }
</style>
