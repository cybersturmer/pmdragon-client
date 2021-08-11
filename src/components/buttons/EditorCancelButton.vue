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
export default {
	name: 'EditorCancelButton',
	emits: [
		'clicked'
	]
}
</script>
