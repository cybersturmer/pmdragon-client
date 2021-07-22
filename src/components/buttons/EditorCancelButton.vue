<template>
  <q-btn
		dense
    flat
    color="secondary"
    label="Cancel"
		class="short"
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

<style lang="scss" scoped>
.short {
	width: 80px;
}
</style>
