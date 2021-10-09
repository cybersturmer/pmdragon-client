<template>
  <q-page class="flex q-layout-padding">
    <div class="column full-width">
			<!-- Sprint header and Create Sprint button -->
      <div class="row q-pb-sm q-pt-none q-pl-sm q-pr-none">
        <div class="col-6">
          <BlockHeader title="Sprints"/>
        </div>
        <div class="col-6">
          <q-btn
            outline
            label="Create"
						color="secondary"
            class="float-right"
            @click="createSprint"
          />
        </div>
      </div>
			<!-- Block with Sprints -->
      <div class="col">
        <q-scroll-area
          visible
          class="fit q-py-sm q-pl-sm q-pr-md"
          style="border-radius: 5px; border: 1px solid #606060;">
            <div
              v-for="(sprint, index) in sprints"
              :key="sprint.id">
              <div class="row q-px-none q-py-sm">
                <div class="col-auto q-py-xs q-pl-xs">
                  <div class="h6 text-primary">
                    {{ sprint.title }}
                    {{ $q.screen.gt.sm ? `- ${sprint.goal} [ ${sprint.issues.length } issues ]`: '' }}
                  </div>
                </div>
                <q-space/>
                <div class="col-auto text-right">
                  <q-btn-group outline>
                    <StartCompleteSprintButton
                      v-if="index === 0"
                      @dialog="editSprintDialog(sprint)"
                      :sprint="sprint"
                    />
                    <SprintMorePopupMenu
                      :sprintId="sprint.id"
                      v-on:edit="editSprintDialog(sprint)"
                      v-on:remove="removeSprintDialog(sprint)"/>
                  </q-btn-group>
                </div>
              </div>
              <div :class="`q-pa-xs ${ $q.dark.isActive ? 'bg-grey-9' : 'bg-accent' }`"
                   style="border-radius: 5px; border: 1px solid #606060; min-height: 67px;">
                <div v-if="!areSprintIssues(sprint.id) && !dragging"
                     class="text-center q-pt-md">
                  Plan sprint by dropping issues here.
								</div>
								<DraggableSprintIssues
									:dragOptions="dragOptions"
									:collectionId="sprint.id"
									:handle="this.$q.screen.lt.sm ? '.handle' : false"
									:class="`q-pa-xs ${dragging ? 'drag-to-point-highlighted' : 'drag-to-point-passive' }`"
									@start="dragging=true"
									@end="dragging=false"/>
							</div>
            </div>
        </q-scroll-area>
      </div>
      <div class="row q-pa-sm">
        <div class="col">
          <BlockHeaderInfo title="Backlog" :info="backlogIssuesLength"/>
        </div>
      </div>
	    <!-- Block of backlog -->
      <div class="col">
        <q-scroll-area
          visible
          class="q-pa-sm q-pr-md"
          style="border-radius: 5px; height: calc(100% - 35px); border: 1px solid #606060; ">
	        <div v-if="isBacklogEmpty && !dragging"
	             class="flex flex-center text-secondary"
	             style="height: calc(40vh - 60px)">
		        <div>
			        Backlog is empty.
		        </div>
	        </div>
					<DraggableBacklogIssues
						v-else
						:drag-options="dragOptions"
						:collection-id="backlog.id"
						:class="`q-pa-xs ${dragging ? 'drag-to-point-highlighted' : 'drag-to-point-passive' }`"
						:handle="this.$q.screen.lt.sm ? '.handle' : false"
						@start="dragging=true"
						@end="dragging=false"
					/>
        </q-scroll-area>
        <q-card bordered
                class="my-card q-ma-sm absolute-bottom q-pa-none">
          <q-card-section class="q-pa-none">
            <q-input
              v-model="formData.title"
              @keyup.enter="createIssue"
              dense
              filled
              placeholder="Add Issue">
              <template v-slot:append>
                <q-btn @click="createIssue"
                       :disable="!isCreateIssueButtonEnabled"
                       dense
                       flat
                       icon="mdi-keyboard-return"/>
              </template>
            </q-input>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { editIssueData } from 'src/pages/mixins/editIssueData'
import { Dialogs } from 'src/pages/mixins/dialogs'
import StartCompleteSprintButton from 'src/components/buttons/StartCompleteSprintButton'
import SprintMorePopupMenu from 'src/components/popups/SprintMorePopupMenu'
import BlockHeader from 'src/components/elements/BlockHeader'
import BlockHeaderInfo from 'src/components/elements/BlockHeaderInfo'
import SprintEditDialog from 'src/components/dialogs/SprintEditDialog'
import IssueEditDialog from 'src/components/dialogs/IssueEditDialog'
import { loading } from 'src/pages/mixins/loading'
import { CoreActionsMixin } from 'src/services/actions/core'
import DraggableIssueCollection from 'components/elements/backlog/interface/DraggableIssueBacklogCollection'
import DraggableBacklogIssues from 'components/elements/backlog/DraggableBacklogIssues'
import DraggableSprintIssues from 'components/elements/backlog/DraggableSprintIssues'

export default defineComponent({
	name: 'BacklogView',
	components: {
		DraggableSprintIssues,
		DraggableBacklogIssues,
		// eslint-disable-next-line vue/no-unused-components
		DraggableIssueCollection,
		// eslint-disable-next-line vue/no-unused-components
		IssueEditDialog,
		// eslint-disable-next-line vue/no-unused-components
		SprintEditDialog,
		BlockHeader,
		BlockHeaderInfo,
		SprintMorePopupMenu,
		StartCompleteSprintButton
	},
	mixins: [
		Dialogs,
		CoreActionsMixin,
		editIssueData,
		loading
	],
	props: {
		/** Passed from the Router */
		issueId: {
			type: Number,
			required: false
		}
	},
	data () {
		return {
			formData: {
				workspace: null,
				title: null,
				project: null,
				type_category: null,
				state_category: null,
				ordering: null
			},
			dragTypes: {
				SPRINT: 1,
				BACKLOG: 0
			},
			dragOptions: {
				animation: 300,
				group: 'issues',
				itemKey: 'id',
				disabled: false,
				ghostClass: 'ghost',
				componentData: {
					type: 'transition-group',
					name: 'flip-list'
				},
				handle: this.$q.screen.lt.sm ? '.handle' : false
			},
			dragging: false,
			isIssueDialogOpened: false
		}
	},
	beforeUpdate () {
		const issueIdPassed = Boolean(this.issueId)
		if (!issueIdPassed) return false

		const isIssueExists = this.$store.getters['core/IS_ISSUE_EXISTS_BY_ID'](this.issueId)

		if (!isIssueExists) {
			this.showRaisedError('Issue is not exist or was removed.')
				.onOk(() => { this.$router.push({ name: 'backlog' }) })

			return
		}

		this.$q.dialog({
			component: IssueEditDialog,
			componentProps: {
				id: this.issueId
			},
			parent: this
		})
	},
	computed: {
		backlog () {
			/** Getting current backlog by chosen workspace and project **/
			return this.$store.getters['core/BACKLOG']
		},
		isBacklogEmpty () {
			return this.$store.getters['core/IS_BACKLOG_EMPTY']
		},
		backlogIssuesCount () {
			return this.$store.getters['core/BACKLOG_ISSUES_COUNT']
		},
		backlogIssuesLength () {
			/** Getting core count **/
			return this.backlogIssuesCount + ' issues'
		},
		sprints () {
			/** Getting all sprints **/
			return this.$store.getters['core/UNCOMPLETED_PROJECT_SPRINTS']
		},
		isCreateIssueButtonEnabled () {
			return Boolean(this.formData.title)
		},
		issueStates () {
			return this.$store.getters['core/ISSUE_STATES_BY_CURRENT_PROJECT']
		},
		issueTypes () {
			return this.$store.getters['core/ISSUE_TYPES_BY_CURRENT_PROJECT']
		}
	},
	methods: {
		createIssue () {
			/** Create Issue, assigned to Backlog by frontend **/
			if (!this.formData.title) return false

			this.formData.workspace = this.$store.getters['auth/WORKSPACE_ID']
			this.formData.project = this.$store.getters['current/PROJECT']

			this.showProgress()
			this.addIssueToBacklog(this.formData)
				.then(() => {
					this.formData.title = ''
				})
				.catch((e) => {
					this.showError(e)
				})
				.finally(() => this.hideProgress())
		},
		editSprintDialog (item) {
			this.$q.dialog({
				component: SprintEditDialog,
				componentProps: {
					id: item.id,
					title: item.title,
					goal: item.goal,
					startedAt: item.started_at,
					finishedAt: item.finished_at
				},
				parent: this,
				dark: this.$q.dark.isActive
			})
				.onOk((data) => {
					this.showProgress()
					this.updateSprint(data)
						.catch((e) => this.showError(e))
						.finally(() => this.hideProgress())
				})
		},
		removeSprintDialog (item) {
			const dialog = [
				'Confirmation',
				`Would you like to delete sprint: "${item.title}"`,
				'Remove',
				'danger'
			]
			this.showOkCancelDialog(...dialog)
				.onOk(() => {
					this.showProgress()
					this.deleteSprint(item.id)
						.finally(() => this.hideProgress())
				})
		},
		sprintIssues (sprintId) {
			return this.$store.getters['core/SPRINT_BY_ID_ISSUES'](sprintId)
		},
		areSprintIssues (sprintId) {
			return this.sprintIssues(sprintId).length > 0
		},
		createSprint () {
			/** Create quite empty sprint **/
			const workspace = this.$store.getters['auth/WORKSPACE_ID']
			const project = this.$store.getters['current/PROJECT']

			const payload = {
				workspace,
				project,
				started_at: null,
				finished_at: null
			}

			this.showProgress()
			this.addSprintToProject(payload)
				.finally(() => this.hideProgress())
		}
	}
})
</script>
<style lang="scss" scoped>
  .flip-list-move {
    transition: transform 0.3s;
  }

  .no-move {
    transition: transform 0.1s;
  }

  .ghost {
    opacity: 0.2;
  }

  .my-card:not(:last-child) {
    margin-bottom: 0.75em;
  }
</style>
