<template>
	<q-card>
		<q-card-section class="column">
			<div class="small_chart col self-center">
				<LineChart />
			</div>
		</q-card-section>
	</q-card>
</template>

<script>
import { defineComponent } from 'vue'
import LineChart from 'components/charts/LineChart'

export default defineComponent({
	name: 'BurnDownChart',
	components: {
		LineChart
	}
})
</script>
<style>
.small_chart {
	width: 600px;
	height: 600px;
}
</style>
