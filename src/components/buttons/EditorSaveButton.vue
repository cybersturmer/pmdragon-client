<template>
  <q-btn
    dense
		outline
    :label="label"
		color="secondary"
    style="width: 80px"
		@click="$emit('clicked')"
  />
</template>

<script>
export default {
	name: 'EditorSaveButton',
	emits: [
		'clicked'
	],
	props: {
		label: {
			type: String,
			required: false,
			default: 'Save'
		}
	}
}
</script>
