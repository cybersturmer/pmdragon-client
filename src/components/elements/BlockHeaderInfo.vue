<template>
  <h5 class="text-primary">
    {{ title }}
    <span v-if="info">
      [&nbsp;{{ info }}&nbsp;]
    </span>
  </h5>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'BlockHeaderInfo',
	props: {
		title: {
			type: String,
			required: true
		},
		info: {
			type: String,
			required: false
		}
	}
})
</script>

<style scoped>
  span {
    font-size: 0.75em;
    text-transform: none;
  }
</style>
