<template>
	<q-item clickable v-ripple @click.prevent="open(url)">
		<q-item-section>
			<q-item-label class="text-center">{{ label }}</q-item-label>
		</q-item-section>
	</q-item>
</template>

<script>
import { platformOpenURL } from 'src/services/platforms'

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
			platformOpenURL(this.url)
		}
	}
}
</script>
