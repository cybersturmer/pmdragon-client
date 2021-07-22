<template>
	<q-item
		clickable
		v-ripple
		class="bg-primary"
		@click="$emit('selected')">
		<q-item-section avatar>
			<q-icon :name="attachment.icon"/>
		</q-item-section>
		<q-item-section>
			{{ attachment.title }}
			<span class="text-secondary" style="font-size: 0.75rem">
				{{ createdBy }} ({{ updatedAt }})
			</span>
		</q-item-section>
	</q-item>
</template>

<script>
export default {
	name: 'AttachmentDialogItem',
	props: {
		attachment: {
			type: Object,
			required: true
		}
	},
	emits: ['selected'],
	computed: {
		createdBy () {
			return this.attachment.created_by
				? this.$store.getters['auth/PERSON_FULL_REPRESENTATION_BY_ID'](this.attachment.created_by)
				: ''
		},
		updatedAt () {
			return this.$moment(this.attachment.updated_at).fromNow()
		}
	}
}
</script>
