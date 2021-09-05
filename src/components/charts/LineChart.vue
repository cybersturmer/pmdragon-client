<template>
	<canvas id="line_chart" width="500" height="500"></canvas>
</template>
<script>
import { defineComponent } from 'vue'
import {
	Chart,
	LinearScale,
	LineController,
	LineElement,
	PointElement,
	CategoryScale
} from 'chart.js'

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
		const ctx = document.getElementById('line_chart').getContext('2d')

		Chart.register(
			LinearScale,
			LineController,
			CategoryScale,
			LineElement,
			PointElement
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
