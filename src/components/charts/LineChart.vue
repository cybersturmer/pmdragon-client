<template>
	<div class="chart-container" style="position: relative; width:70vw">
		<canvas id="line_chart" ></canvas>
	</div>
</template>
<script>
import { defineComponent } from 'vue'
import {
	Chart,
	LinearScale,
	LineController,
	LineElement,
	PointElement,
	CategoryScale,
	TimeScale,
	TimeSeriesScale,
	Tooltip,
	Legend
} from 'chart.js'

import 'chartjs-adapter-moment'

export default defineComponent({
	name: 'LineChart',
	props: {
		chartdata: {
			type: Object,
			required: true
		},
		options: {
			type: Object,
			required: true
		}
	},
	mounted () {
		/** Let's skip Chart initialization if element was not found */
		const $lineChartElement = document.getElementById('line_chart')
		if (!$lineChartElement) return false

		const ctx = $lineChartElement.getContext('2d')

		Chart.register(
			LinearScale,
			LineController,
			CategoryScale,
			LineElement,
			PointElement,
			TimeScale,
			TimeSeriesScale,
			Tooltip,
			Legend
		)

		// eslint-disable-next-line no-unused-vars
		const myChart = new Chart(ctx, {
			type: 'line',
			data: this.chartdata,
			options: this.options
		})
	}
})
</script>
