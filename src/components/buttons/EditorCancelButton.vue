<template>
  <q-btn
		dense
    flat
    color="secondary"
    label="Cancel"
    style="width: 80px"
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
