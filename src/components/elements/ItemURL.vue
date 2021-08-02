<template>
	<q-item clickable v-ripple @click.prevent="open(url)">
		<q-item-section>
			<a :href="url" class="q-btn q-btn--flat">
				{{ label }}
			</a>
		</q-item-section>
	</q-item>
</template>

<script>
import { openURL } from 'quasar'
import { openInAppBrowser } from 'src/services/platforms'

export default {
	name: 'ItemURL',
	props: {
		url: {
			type: String,
			required: true
		},
		label: {
			type: String,
			required: true
		}
	},
	methods: {
		open () {
			if (this.$q.platform.is.ios || this.$q.platform.is.android) {
				openInAppBrowser(this.url)
			} else {
				openURL(this.url)
			}
		}
	}
}
</script>

<style scoped>

</style>
