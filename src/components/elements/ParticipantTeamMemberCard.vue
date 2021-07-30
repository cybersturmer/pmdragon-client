<template>
	<div class="q-pa-xs col-xs-6 col-sm-6 col-md-3 col-lg-2 col-xl-2">
		<q-card
		bordered>
		<q-card-section horizontal>
			<!-- Avatar block -->
			<q-card-section class="flex flex-center">
				<q-avatar v-if="person.avatar">
					<img :src="person.avatar" :alt="person.username">
				</q-avatar>
			</q-card-section>
			<!-- Name block -->
			<q-card-section class="text-center">
				<span class="block">{{ person.first_name }}</span>
				<span class="block">{{ person.last_name }}</span>
				<span class="text-subtitle2">@{{ person.username }}</span>
			</q-card-section>
			<q-card-actions
				v-if="!isMe && isOwner"
				class="col-1 q-pa-none"
			>
				<q-btn
					flat
					dense
					icon="mdi-dots-vertical q-pa-none">
					<q-menu
						fit
						anchor="bottom end"
						self="top right"
						auto-close
						content-class="bg-negative text-white"
					>
						<q-list>
							<q-item clickable
											@click="$emit('removeTeamMember', person.id)">
								<q-item-section>Remove from Workspace</q-item-section>
							</q-item>
						</q-list>
					</q-menu>
				</q-btn>
			</q-card-actions>
		</q-card-section>
	</q-card>
	</div>
</template>

<script>
export default {
	name: 'ParticipantTeamMemberCard',
	props: {
		person: {
			type: Object,
			required: true
		}
	},
	computed: {
		isMe () {
			return this.$store.getters['auth/IS_ME_BY_ID'](this.person.id)
		},
		isOwner () {
			return this.$store.getters['auth/IS_ME_OWNER_OF_PROJECT']
		}
	}
}
</script>

<style scoped>
.q-card__actions {
	padding: 0!important;
}
</style>
