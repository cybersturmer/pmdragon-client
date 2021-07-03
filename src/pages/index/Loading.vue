<template>
  <q-page class="q-pa-lg">
  </q-page>
</template>

<script>
import { loading } from 'pages/mixins/loading'

export default {
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
}
</script>
