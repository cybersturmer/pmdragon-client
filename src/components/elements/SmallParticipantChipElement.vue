<template>
  <q-chip
		:color="`${$q.dark.isActive ? 'info' : 'accent'}`"
		square
    :key="participant.id">
    <q-avatar v-if="participant.avatar">
      <img
        :src="participant.avatar"
        :alt="`${participant.first_name} ${participant.last_name}`">
    </q-avatar>
		<span class="text-bold">{{ participant.first_name }} {{ participant.last_name }}</span>
  </q-chip>
</template>

<script>
export default {
	name: 'SmallParticipantChipElement',
	props: {
		participant: {
			type: Object,
			required: true
		}
	}
}
</script>
