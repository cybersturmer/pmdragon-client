<template>
  <q-btn
    dense
		outline
    :label="label"
		color="secondary"
		class="short"
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

<style lang="scss" scoped>
	.short {
		width: 80px;
	}
</style>
