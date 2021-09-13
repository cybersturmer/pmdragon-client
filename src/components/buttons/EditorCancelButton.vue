<template>
  <q-btn
    flat
    color="secondary"
    label="Cancel"
		class="q-px-xs"
		@click="$emit('clicked')"
  />
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'EditorCancelButton',
	emits: [
		'clicked'
	]
})
</script>
