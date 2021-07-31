<template>
	<div class="q-pa-xs col-xs-6 col-sm-6 col-md-4 col-lg-3 col-xl-2">
		<q-card
		bordered>
			<q-card-section horizontal class="full-width">
				<!-- Avatar block -->
				<q-card-section class="col-3 flex flex-center">
					<q-avatar v-if="person.avatar">
						<img :src="person.avatar" :alt="person.username">
					</q-avatar>
				</q-card-section>
				<!-- Name block -->
				<q-card-section class="col-7 text-center">
					<span class="block ellipsis">{{ person.first_name }} {{ person.last_name }}</span>
					<span class="text-subtitle2">@{{ person.username }}</span>
				</q-card-section>
				<q-card-actions
					v-if="!isMe && isOwner"
					class="q-pa-none col-2">
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
