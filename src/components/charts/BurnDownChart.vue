<template>

</template>

<script>
import LineChart from 'components/charts/LineChart.vue'

export default {
  name: 'BurnDownChart',
  components: { LineChart },
  data: () => ({
    loaded: false,
    chartdata: null
  }),
  async mounted () {
    this.loaded = false
    try {
    //  Dispatch method to get history
    } catch (e) {
      console.error(e)
    }
  }
}
</script>

<style scoped>

</style>
