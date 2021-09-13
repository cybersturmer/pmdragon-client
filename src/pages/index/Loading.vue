<template>
  <q-page class="q-pa-lg">
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { loading } from 'src/pages/mixins/loading'

export default defineComponent({
	name: 'LoadingView',
	mixins: [loading],
	data () {
		return {
			module: 'data'
		}
	},
	mounted () {
		this.loadData()
	}
})
</script>
