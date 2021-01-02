<template>
  <q-card
    dark>
    <q-card-section>
      <LineChart
        v-if="isLoaded"
        :chartdata="chartdata"
        :options="options"
      />
    </q-card-section>
  </q-card>
</template>

<script>
import LineChart from 'components/charts/LineChart.vue'
import { date } from 'quasar'

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
      tooltips: {
        mode: 'index',
        intersect: false
      },
      scales: {
        xAxes: [{
          type: 'time',
          distribution: 'series',
          bounds: 'data',
          time: {
            parser: 'MM DD YYYY',
            unit: 'day',
            round: 'day',
            tooltipFormat: 'll'
          },
          ticks: {
            source: 'data',
            autoSkip: true
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Story Points'
          }
        }]
      }
    }
  }),
  async mounted () {
    this.isLoaded = false
    const sprint = this.$store.getters['issues/CURRENT_SPRINT']
    const sprintStartedAt = new Date(sprint.started_at)
    const sprintFinishedAt = new Date(sprint.finished_at)
    const diffDays = date
      .getDateDiff(sprintFinishedAt, sprintStartedAt, 'days')

    const totalValue = this.$store.getters['issues/STORY_POINT_TOTAL_FOR_STARTED_SPRINT']
    const perDayDecrement = totalValue / diffDays

    const daysLabels = []
    const expectedValues = []
    for (let i = diffDays; i >= 0; i--) {
      const dayNumber = diffDays - i
      daysLabels.push(date.addToDate(sprintStartedAt, { days: dayNumber }))
      expectedValues.push(Math.round(totalValue - perDayDecrement * dayNumber))
    }
    expectedValues.push(0)

    this.chartdata = {
      labels: daysLabels,
      datasets: [
        {
          label: 'Expectation',
          fill: false,
          borderColor: '#616161',
          data: expectedValues
        }
      ]
    }

    this.isLoaded = true
  }
}
</script>
