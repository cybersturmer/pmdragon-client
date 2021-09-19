<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card flat bordered class="q-dialog-plugin">
      <q-card-section>
        <q-table
          flat
          square
          dense
          bordered
          ref="table"
          row-key="email"
          no-data-label="Invite your team members by adding them by email."
          hide-bottom
          hide-header
          :rows="teamTableData.data"
          :columns="teamTableData.columns"
          :pagination="teamTableData.pagination"
        >
          <template #body-cell-email="props">
            <q-td :props="props">
              {{ props.row.email }}
              <q-btn
                flat
                dense
                icon="mdi-account-minus"
                size="sm"
                class="float-right"
                @click="cancelInvitation(props.row.email)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="teamFormEmail"
          type="email"
          square
          dense
          filled
          placeholder="user@mail.com"
          @keyup.enter="addTeamMember"
        >
          <template #append>
            <q-btn dense
                   flat
                   icon="mdi-keyboard-return"
                   @click="addTeamMember"
            />
          </template>
        </q-input>
      </q-card-section>
      <q-card-actions vertical>
        <q-btn
          outline
          label="Invite"
          color="secondary"
          @click="onOKClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from 'vue'
import { fieldValidationMixin } from 'src/pages/mixins/fieldValidation'
import { Dialogs } from 'src/pages/mixins/dialogs'
import { loading } from 'src/pages/mixins/loading'

export default defineComponent({
	name: 'SprintEditDialog',
	emits: [
		'ok',
		'hide'
	],
	mixins: [
		fieldValidationMixin,
		Dialogs,
		loading
	],
	components: { },
	data () {
		return {
			teamTableData: {
				columns: [
					{
						name: 'email',
						required: true,
						align: 'left',
						field: row => row.email,
						format: val => `${val}`,
						sortable: true
					}
				],
				pagination: {
					rowsPerPage: 0
				},
				data: []
			},
			teamFormErrors: {},
			teamFormEmail: null
		}
	},
	methods: {
		addTeamMember () {
			/** Just add a team member to temp var **/
			/** Empty string return false in Js **/
			if (!this.teamFormEmail) return false

			if (!this.isValidEmail(this.teamFormEmail)) {
				this.showOkDialog(
					'Not a correct email',
					'Please input correct email address'
				)

				return false
			}

			this.teamTableData.data.push({
				email: this.teamFormEmail
			})

			this.teamFormEmail = null
		},
		cancelInvitation (email) {
			/**
       * Just remove email from the payload that we gonna send to
       * create team members **/

			this.teamTableData.data = this.teamTableData.data.filter((row) => row.email !== email)
		},
		show () {
			this.$refs.dialog.show()
		},

		hide () {
			this.$refs.dialog.hide()
		},

		onDialogHide () {
			this.$emit('hide')
		},

		async onOKClick () {
			/** Let's add already filled team member **/

			this.addTeamMember()
			/** Create team by sending emails on server **/
			this.showProgress()

			const payload = {
				invites: []
			}

			const teamData = this.teamTableData.data

			for (const emailElement in teamData) {
				const dictPayload = {
					email: teamData[emailElement].email,
					workspace: this.$store.getters['auth/WORKSPACE_ID']
				}

				payload.invites.push(dictPayload)
			}

			this.inviteTeam(payload)
				.finally(() => this.hideProgress())

			this.isTeamStepDone = true
			this.$emit('ok', payload)
			this.hide()
		},

		onCancelClick () {
			this.hide()
		}
	}
})
</script>
