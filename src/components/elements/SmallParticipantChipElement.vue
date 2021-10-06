<template>
  <q-chip
		:color="`${$q.dark.isActive ? 'info' : 'accent'}`"
		:text-color="`${$q.dark.isActive ? 'accent' : 'dark'}`"
		square
    :key="participant.id">
    <q-avatar v-if="avatar">
      <img
        :src="avatar"
        :alt="title">
    </q-avatar>
		<span class="text-bold">{{ nameIsDefined ? title : username }}</span>
  </q-chip>
</template>

<script>
import { defineComponent, computed } from 'vue'

export default defineComponent({
	name: 'SmallParticipantChipElement',
	props: {
		participant: {
			type: Object,
			required: true
		}
	},
	setup (props, context) {
		const nameIsDefined = computed(() => {
			return Boolean(props.participant.first_name) && Boolean(props.participant.last_name)
		})

		const title = computed(() => {
			return `${props.participant.first_name} ${props.participant.last_name}`
		})

		const username = computed(() => {
			return props.participant.username
		})

		const avatar = computed(() => {
			return props.participant.avatar
		})

		return {
			avatar,
			title,
			username,
			nameIsDefined
		}
	}
})
</script>
