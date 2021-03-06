<template>
  <q-page class="q-layout-padding">
    <q-table
      grid
      row-key="username"
      no-data-label="Invite your team members by adding them by email."
      :data="participants"
      :columns="teamTable.columns"
      :filter="teamTable.filter">
      <template #top-left>
        <q-btn-group outline>
          <q-btn
            outline
            label="Invite a teammate"
            color="secondary"
            @click="inviteMembersDialog"
          />
        </q-btn-group>
      </template>
      <template #top-right>
        <q-input dense debounce="300" v-model="teamTable.filter" placeholder="Search">
          <template #append>
            <q-icon name="mdi-account-search" />
          </template>
        </q-input>
      </template>
      <template #item="props">
        <div class="q-pa-xs col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2" >
          <q-card bordered>
            <q-card-section horizontal>
              <!-- Avatar block -->
              <q-card-section class="col-4">
                <q-avatar
                  v-if="getAvatarByPersonId(props.row.id)">
                  <img :src="getAvatarByPersonId(props.row.id)" :alt="props.row.username">
                </q-avatar>
              </q-card-section>
              <!-- Name block -->
              <q-card-section class="col-8">
                <div class="row items-center no-wrap full-width">
                  <div class="col-10 text-center">
                    <p class="text-subtitle2 q-pa-none q-ma-none" style="line-height: 1.5rem">{{ props.row.first_name }}</p>
                    <p class="text-subtitle2 q-pa-none q-ma-none" style="line-height: 1.5rem">{{ props.row.last_name }}</p>
                  </div>
                  <div class="col-2 items-center">
                    <q-btn
                      v-show="!isMe(props.row.id) && notOwner(props.row.id)"
                      flat
                      dense
                      color="secondary"
                      icon="mdi-dots-vertical">
                      <q-menu fit anchor="top left" self="top left" auto-close>
                        <q-list>
                          <q-item clickable
                                  @click="removeMemberDialog(props.row.id)">
                            <q-item-section>Remove from Workspace</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-btn>
                  </div>
                </div>
              </q-card-section>
            </q-card-section>
          </q-card>
        </div>
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
        <div class="q-pa-xs col-xs-12 col-sm-5 col-md-6 col-lg-3 col-xl-2">
          <q-card bordered>
            <q-card-section style="height: 90px">
              <p class="q-ma-sm q-pa-none">
                <strong>Email:</strong>
                {{ props.row.email }}
              </p>
              <p class="q-ma-sm q-pa-none" :title="props.row.expired_at">
                <strong>Expired:</strong> {{ props.row.expired_at | moment("from", "now") }}
              </p>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import InviteMemberDialog from 'src/components/dialogs/InviteMemberDialog'
import { loading } from 'src/pages/mixins/loading'

export default {
	name: 'Team',
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
		getAvatarByPersonId (id) {
			try {
				return this.$store.getters['auth/PERSON_BY_ID'](id).avatar
			} catch (e) {
				return false
			}
		},
		isMe (personId) {
			return this.$store.getters['auth/MY_PERSON_ID'] === personId
		},
		notOwner (personId) {
			return this.$store.getters['auth/PROJECT_OWNED_BY'].id !== personId
		},
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
			this.$q.dialog({
				dark: this.$q.dark.isActive,
				title: 'Confirmation',
				message: `Would you like to remove participant: ${participant.first_name} ${participant.last_name}`,
				cancel: true,
				persistent: true
			})
				.onOk(() => {
					this.showProgress()
					this.$store.dispatch('auth/REMOVE_TEAM_MEMBER', personId)
						.finally(() => this.hideProgress())
				})
		}
	}
}
</script>
