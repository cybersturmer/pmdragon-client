<template>
  <q-btn
    dense
		outline
    :label="label"
		color="secondary"
    style="width: 80px"
  />
</template>

<script>
export default {
	name: 'EditorSaveButton',
	props: {
		label: {
			type: String,
			required: false,
			default: 'Save'
		}
	}
}
</script>
