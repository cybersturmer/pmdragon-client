<template>
  <h5 class="text-primary">{{ title }}</h5>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'BlockHeader',
	props: {
		title: {
			type: String,
			required: true
		}
	}
})
</script>
