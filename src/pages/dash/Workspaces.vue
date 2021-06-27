<template>
  <q-page class="q-pa-lg">
    <div class="row">
      <q-table
        dark
        grid
        class="full-width items-center"
        :data="workspaces"
        no-data-label="You are not participating in any workspace"
        :filter="workspacesTable.filter"
        :filter-method="filterByString"
        :pagination="workspacesTable.pagination"
      >
        <template #top-left>
          <q-btn-group outline>
            <q-btn
              outline
              size="md"
              color="amber"
              label="Create Workspace"
              @click="createWorkspaceDialog"
            />
            <q-btn
              outline
              size="md"
              color="amber"
              label="Create Project"
              @click="createProjectDialog"
            />
          </q-btn-group>
        </template>
        <template #top-right>
          <q-input dark dense debounce="300" v-model="workspacesTable.filter" placeholder="Search">
            <template #append>
              <q-icon name="mdi-cloud-search" />
            </template>
          </q-input>
        </template>
        <template #item="props">
          <div class="q-pa-xs col-xs-12 col-sm-12 col-md-6">
            <q-card dark bordered style="min-width: 350px">
              <q-card-section class="text-center">
                <div class="text-h6 text-uppercase">{{ props.row.prefix_url }}</div>
                <div class="text-subtitle2 text-amber">Participants</div>
                <SmallParticipantChipElement
                  v-for="participant in props.row.participants"
                  v-bind:key="participant.id"
                  :participant="participant"
                />
              </q-card-section>
              <q-card-actions v-if="props.row.projects.length > 0" vertical>
                <q-btn v-for="project in props.row.projects"
                       v-bind:key="project.id"
                       outline
                       color="amber"
                       @click="selectSpace(props.row.prefix_url, project.id)"
                >
                  {{ project.title }}
                </q-btn>
              </q-card-actions>
              <q-card-section class="text-center" style="border-top: 1px dashed #696969" v-else>
                <div>
                    <q-btn
                      dark
                      flat
                      outline
                      color="amber"
                      @click="createProjectDialog(props.row.id)">Create Project</q-btn>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import SmallParticipantChipElement from 'components/elements/SmallParticipantChipElement.vue'
import WorkspaceCreateDialog from 'components/dialogs/WorkspaceCreateDialog.vue'
import ProjectCreateDialog from 'components/dialogs/ProjectCreateDialog.vue'
import { websocket } from 'pages/mixins/websockets'

export default {
	name: 'WorkspacesView',
	mixins: [websocket],
	components: { SmallParticipantChipElement },
	data () {
		return {
			workspacesTable: {
				filter: '',
				columns: [
					{
						name: 'workspace',
						sortable: true
					}
				],
				pagination: {
					rowsPerPage: 6
				}
			}
		}
	},
	methods: {
		createWorkspaceDialog () {
			const options = {
				parent: this,
				dark: true,
				title: 'Create Workspace',
				component: WorkspaceCreateDialog
			}

			this.$q.dialog(options)
				.onOk((data) => {
					this.createProjectDialog(data.id)
				})
		},
		createProjectDialog (workspaceId) {
		  console.log(workspaceId)

			const options = {
				parent: this,
				dark: true,
				title: 'Create Project',
				component: ProjectCreateDialog,
				workspaceId: workspaceId
			}

			this.$q.dialog(options)
				.onOk(() => {
					this.$router.push({ name: 'loading' })
				})
		},
		selectSpace (prefixUrl, projectId) {
			this.unsubscribeIssuesInWorkspace()

			/** Then select new Workspace and Project */
			this.$store.dispatch('current/SELECT_WORKSPACE', prefixUrl)
			this.$store.dispatch('current/SELECT_PROJECT', projectId)

			this.subscribeIssuesInWorkspace()

			this.$router.push({ name: 'backlog' })
		},
		filterByString (rows, terms, cols, getCellValue) {
			const regex = new RegExp(terms, 'i')

			return rows
				.filter((workspace) =>
					workspace.prefix_url.match(regex) ||
          workspace.projects.find(project => project.title.match(regex))
				)
		}
	},
	computed: {
		workspaces () {
			return this.$store.getters['auth/WORKSPACES']
		}
	},
	mounted () {
		this.$store.dispatch('current/RESET_WORKSPACE')
		this.$store.dispatch('current/RESET_PROJECT')
	}
}
</script>
