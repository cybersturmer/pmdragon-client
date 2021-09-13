<template>
	<q-page class="q-layout-padding">
		<q-table
			grid
			row-key="username"
			no-data-label="Invite your team members by adding them by email."
			:rows="participants"
			:columns="teamTable.columns"
			:filter="teamTable.filter">
			<template #top-left>
				<q-input dense debounce="300" v-model="teamTable.filter" placeholder="Search">
					<template #append>
						<q-icon name="mdi-account-search" />
					</template>
				</q-input>
			</template>
			<template #top-right>
				<q-btn-group outline>
					<q-btn
						outline
						label="Invite a teammate"
						color="secondary"
						@click="inviteMembersDialog"
					/>
				</q-btn-group>
			</template>
			<template #item="props">
				<ParticipantTeamMemberCard
					:person="props.row"
					@removeTeamMember="removeMemberDialog($event)"/>
			</template>
		</q-table>
		<q-table
			grid
			class="text-secondary"
			:title="`Invited - ( ${invited.length} email )`"
			row-key="email"
			no-data-label="Invite your team members by adding them by email."
			:data="invited"
			:columns="invitedTable.columns"
			:filter="invitedTable.filter"
			:pagination="invitedTable.pagination">
			<template #item="props">
				<InvitedTeamMemberCard :invitation="props.row"/>
			</template>
		</q-table>
	</q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { loading } from 'src/pages/mixins/loading'
import InviteMemberDialog from 'src/components/dialogs/InviteMemberDialog'
import InvitedTeamMemberCard from 'components/elements/team/InvitedTeamMemberCard'
import ParticipantTeamMemberCard from 'src/components/elements/team/ParticipantTeamMemberCard'

export default defineComponent({
	name: 'Team',
	components: {
		ParticipantTeamMemberCard,
		InvitedTeamMemberCard
	},
	mixins: [loading],
	data () {
		return {
			teamTable: {
				columns: [
					{
						name: 'avatar'
					},
					{
						name: 'username',
						required: true,
						label: 'Username',
						align: 'left',
						field: row => row.username,
						format: val => `${val}`,
						sortable: true
					},
					{
						name: 'name',
						required: true,
						label: 'Name',
						field: row => `${row.first_name} ${row.last_name}`,
						sortable: true
					}
				],
				filter: ''
			},
			invitedTable: {
				columns: [
					{
						name: 'email',
						required: true,
						label: 'Email',
						align: 'left',
						field: row => row.email,
						format: val => `${val}`,
						sortable: true
					},
					{
						name: 'expired',
						required: true,
						label: 'Expired At',
						field: row => this.$moment(row.expired_at).fromNow(),
						sortable: true
					}
				],
				pagination: {
					rowsPerPage: 8
				},
				filter: ''
			}
		}
	},
	computed: {
		participants () {
			return this.$store.getters['auth/PARTICIPANTS_BY_CURRENT_PROJECT']
		},
		invited () {
			const workspaceId = this.$store.getters['auth/WORKSPACE_ID']
			const invited = this.$store.getters['auth/INVITED']

			return invited.filter((invitation) => invitation.workspace === workspaceId)
		}
	},
	methods: {
		inviteMembersDialog () {
			this.$q.dialog({
				parent: this,
				dark: this.$q.dark.isActive,
				title: 'Invite Members',
				component: InviteMemberDialog
			})
		},
		removeMemberDialog (personId) {
			const participant = this.$store.getters['auth/PERSON_BY_ID'](personId)
			const dialog = [
				'Confirmation',
				`Would you like to delete participant from the Workspace: "${participant.first_name} ${participant.last_name}"`,
				'Remove',
				'danger'
			]

			this.showOkCancelDialog(...dialog)
				.onOk(() => {
					this.showProgress()
					this.removeTeamMember(personId)
						.finally(() => this.hideProgress())
				})
		}
	}
})
</script>
