<template>
  <q-btn
		outline
    :label="label"
		color="secondary"
		class="q-px-xs"
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
