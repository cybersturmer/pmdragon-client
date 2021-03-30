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
              size="sm"
              color="amber"
              label="Create Workspace"
              @click="createWorkspaceDialog"
            />
            <q-btn
              outline
              size="sm"
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
              <q-card-actions vertical>
                <q-btn v-for="project in props.row.projects"
                       v-bind:key="project.id"
                       outline
                       color="amber"
                       @click="selectSpace(props.row.prefix_url, project.id)"
                >
                  {{ project.title }}
                </q-btn>
              </q-card-actions>
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

export default {
  name: 'WorkspacesView',
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
    createProjectDialog () {
      const options = {
        parent: this,
        dark: true,
        title: 'Create Project',
        component: ProjectCreateDialog
      }

      this.$q.dialog(options)
        .onOk(() => {
          this.$router.push({ name: 'loading' })
        })
    },
    selectSpace (prefixUrl, projectId) {
      /** Let's unsubscribe from previously subscribed workspace */
      const unsubscribePayload = {
        action: 'unsubscribe_from_issues_in_workspace',
        request_id: this.$store.getters['connection/SOCKET_REQUEST_ID'],
        workspace_pk: this.$store.getters['auth/WORKSPACE_ID']
      }

      this.$socket.sendObj({
        stream: 'workspace_issues',
        payload: unsubscribePayload
      })

      /** Then select new Workspace and Project */
      this.$store.dispatch('current/SELECT_WORKSPACE', prefixUrl)
      this.$store.dispatch('current/SELECT_PROJECT', projectId)

      /** And now let's subscribe issues from new Workspace */
      const subscribePayload = {
        action: 'subscribe_to_issues_in_workspace',
        request_id: this.$store.getters['connection/SOCKET_REQUEST_ID'],
        workspace_pk: this.$store.getters['auth/WORKSPACE_ID']
      }

      this.$socket.sendObj({
        stream: 'workspace_issues',
        payload: subscribePayload
      })

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
      const workspaces = this.$store.getters['auth/WORKSPACES']
      return workspaces.filter(workspace => workspace.projects.length > 0)
    }
  },
  mounted () {
    this.$store.dispatch('current/RESET_WORKSPACE')
    this.$store.dispatch('current/RESET_PROJECT')
  }
}
</script>
