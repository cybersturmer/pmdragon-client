<template>
  <h5 class="text-secondary">{{ title }}</h5>
</template>

<script>
export default {
	name: 'BlockHeader',
	props: {
		title: {
			type: String,
			required: true
		}
	}
}
</script>
