<template>
  <q-btn
		dense
    flat
    color="secondary"
    label="Cancel"
		class="short_button"
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
