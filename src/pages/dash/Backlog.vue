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
                  <div class="h6 text-secondary">
                    {{ sprint.title }}
                    {{ $q.screen.gt.sm ? `- ${sprint.goal} (${sprint.issues.length }) issues`: '' }}
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
              <div :class="`q-pt-sm q-px-xs q-pb-none ${ $q.dark.isActive ? 'bg-grey-9' : 'bg-accent' }`"
                   style="border: 1px solid #606060; min-height: 67px;">
                <div v-if="!areSprintIssues(sprint.id) && !dragging"
                     class="text-center q-pt-md">
                  Plan sprint by dropping issues here.
                </div>
                <draggable
                  :value="sprintIssues(sprint.id)"
                  :handle="$q.screen.lt.sm ? '.handle' : false"
                  v-bind="dragOptions"
                  @change="handleDraggableEvent($event, dragTypes.SPRINT, sprint.id)"
                  @start="dragging=true"
                  @end="dragging=false"
                >
                  <transition-group
										type="transition"
										name="flip-list"
										tag="div"
										:style=" dragging ? `min-height: 100px` : ''">
                    <IssueBacklog
                      v-for="issue in sprintIssues(sprint.id)"
                      :key="issue.id"
                      :issue="issue"
                    />
                  </transition-group>
                </draggable>
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
          class="q-py-sm q-pl-sm q-pr-md"
          style="border-radius: 5px; height: calc(100% - 35px); border: 1px solid #606060;">
	        <div v-if="isBacklogEmpty && !dragging"
	             class="flex flex-center text-secondary"
	             style="height: calc(40vh - 60px)">
		        <div>
			        Backlog is empty.
		        </div>
	        </div>
          <draggable
		        v-else
            :value="backlogIssues"
            :handle="$q.screen.lt.sm ? '.handle' : false"
            v-bind="dragOptions"
            @change="handleDraggableEvent($event, dragTypes.BACKLOG, backlog.id)"
            @start="dragging=true"
            @end="dragging=false"
						class="full-height full-width"
            :style="`min-height: 30vh; ${dragging ? 'border: 1px dashed #424242' : ''}`">
            <transition-group
		            type="transition"
		            name="flip-list"
		            tag="div">
              <IssueBacklog
                v-for="issue in backlogIssues"
                :key="issue.id"
                :issue="issue"
              />
            </transition-group>
          </draggable>
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
import draggable from 'vuedraggable'
import { editIssueData } from 'src/pages/mixins/editIssueData'
import { Dialogs } from 'src/pages/mixins/dialogs'
import { unWatch } from 'src/services/util'
import IssueBacklog from 'src/components/elements/IssueBacklog'
import StartCompleteSprintButton from 'src/components/buttons/StartCompleteSprintButton'
import SprintMorePopupMenu from 'src/components/popups/SprintMorePopupMenu'
import BlockHeader from 'src/components/elements/BlockHeader'
import BlockHeaderInfo from 'src/components/elements/BlockHeaderInfo'
import SprintEditDialog from 'src/components/dialogs/SprintEditDialog'
import IssueEditDialog from 'src/components/dialogs/IssueEditDialog'
import { loading } from 'src/pages/mixins/loading'
import { CoreActionsMixin } from 'src/services/actions/core'

export default {
	name: 'BacklogView',
	components: {
		// eslint-disable-next-line vue/no-unused-components
		IssueEditDialog,
		// eslint-disable-next-line vue/no-unused-components
		SprintEditDialog,
		BlockHeader,
		BlockHeaderInfo,
		SprintMorePopupMenu,
		StartCompleteSprintButton,
		draggable,
		IssueBacklog
	},
	mixins: [
		Dialogs,
		CoreActionsMixin,
		editIssueData,
		loading
	],
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
				animation: 200,
				group: 'issues',
				disabled: false,
				ghostClass: 'ghost'
			},
			dragging: false,
			isIssueDialogOpened: false
		}
	},
	mounted () {
		try {
			const issueId = parseInt(this.$route.params.id)

			const isIssueExists = this.$store.getters['core/IS_ISSUE_EXISTS_BY_ID'](issueId)

			if (!issueId) return false

			if (isIssueExists) {
				this.$q.dialog({
					parent: this,
					dark: this.$q.dark.isActive,
					title: 'Issue ',
					component: IssueEditDialog,
					id: issueId
				})
			} else {
				this.showRaisedError('Issue is not exist or was removed.')
					.onOk(() => {
						this.$router.push({ name: 'backlog' })
					})
			}
		} catch (e) {
			console.log(e)
		}
	},
	computed: {
		backlog () {
			/** Getting current backlog by chosen workspace and project **/
			return this.$store.getters['core/BACKLOG']
		},
		backlogIssues () {
			/** Getting current backlog core **/
			return this.$store.getters['core/BACKLOG_ISSUES']
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
				parent: this,
				dark: this.$q.dark.isActive,
				component: SprintEditDialog,
				id: item.id,
				title: item.title,
				goal: item.goal,
				startedAt: item.started_at,
				finishedAt: item.finished_at
			})
				.onOk((data) => {
					this.showProgress()
					this.editSprint(data)
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
		handleCommonMoved (issuesList, event) {
			/** Handle moving - doesnt matter is it sprint or backlog **/

			const immutableList = unWatch(issuesList)

			immutableList
				.splice(event.moved.newIndex, 0, immutableList
					.splice(event.moved.oldIndex, 1)[0])

			const ordering = []
			immutableList.forEach((issueId, index) => {
				ordering.push(
					{
						id: issueId,
						ordering: index
					}
				)
			})

			return { list: immutableList, ordering }
		},
		handleSprintIssueMoved (event, sprintId) {
			/** Handling moving inside of sprint **/
			const currentSprintIssues = this.$store.getters['core/SPRINT_BY_ID'](sprintId).issues

			const handled = this.handleCommonMoved(currentSprintIssues, event)

			this.showProgress()
			this.updateIssuesOrdering(handled.ordering)
				.then(() => {
					const payload = {
						id: sprintId,
						issues: handled.list
					}

					this.$store.commit('core/UPDATE_SPRINT_ISSUES', payload)
				}).finally(() => this.hideProgress())
		},
		handleBacklogIssueMoved (event, backlogId) {
			/** Handling moving inside of backlog **/
			const currentBacklogIssues = this.$store.getters['core/BACKLOG'].issues

			const handled = this.handleCommonMoved(currentBacklogIssues, event)

			this.showProgress()
			this.updateIssuesOrdering(handled.ordering)
				.then(() => {
					this.$store.commit('core/UPDATE_BACKLOG_ISSUES', {
						id: backlogId,
						issues: handled.list
					})
				})
				.finally(() => this.hideProgress())
		},
		handleCommonAdded (issuesList, event) {
			const immutableList = unWatch(issuesList)

			immutableList.splice(event.added.newIndex, 0, event.added.element.id)

			const ordering = []
			immutableList.forEach((issueId, index) => {
				ordering.push(
					{
						id: issueId,
						ordering: index
					}
				)
			})

			return { list: immutableList, ordering }
		},
		notifyAboutStartedSprintAffecting (event, sprintId) {
			/** Notify if someone start to put core in already started sprint or take it from **/
			const isSprintStarted = this.$store.getters['core/IS_SPRINT_STARTED_BY_ID'](sprintId)
			if (!isSprintStarted) return false

			let elId = null
			let actionText = ''
			switch (true) {
			case 'added' in event:
				elId = event.added.element.id
				actionText = 'adding'
				break
			case 'removed' in event:
				elId = event.removed.element.id
				actionText = 'removing'
				break
			default:
				throw Error('Unexpected event data')
			}

			const droppedIssue = this.$store.getters['core/ISSUE_BY_ID'](elId)

			const dialog = [
				'Started Sprint affected',
				`By ${actionText} #${droppedIssue.id} - ${droppedIssue.title} you affect already started Sprint.`
			]
			this.showOkDialog(...dialog)
		},
		handleSprintIssueAdded (event, sprintId) {
			/** Handling adding inside of Sprint **/
			const currentSprintIssues = this.$store.getters['core/SPRINT_BY_ID_ISSUES_IDS'](sprintId)
			const handled = this.handleCommonAdded(currentSprintIssues, event)
			const compositeSprintIdsList = {
				id: sprintId,
				issues: handled.list
			}

			this.showProgress()
			this.updateIssuesInSprint(compositeSprintIdsList)
				.then(() => this.updateIssuesOrdering(handled.ordering))
				.finally(() => this.hideProgress())
		},
		handleBacklogIssueAdded (event, backlogId) {
			/** Handling adding to Backlog **/
			const currentBacklogIssues = this.$store.getters['core/BACKLOG'].issues

			const handled = this.handleCommonAdded(currentBacklogIssues, event)
			const compositeBacklogIdsList = {
				id: backlogId,
				issues: handled.list
			}

			this.showProgress()
			this.updateIssuesInBacklog(compositeBacklogIdsList)
				.then(() => this.updateIssuesOrdering(handled.ordering))
				.finally(() => this.hideProgress())
		},
		handleCommonRemoved (issuesList, event) {
			const list = unWatch(issuesList)

			list.splice(event.removed.oldIndex, 1)

			const ordering = []
			list.forEach((issueId, index) => {
				ordering.push(
					{
						id: issueId,
						ordering: index
					}
				)
			})

			return { list, ordering }
		},
		handleSprintIssueRemoved (event, sprintId) {
			/** Handling removing from Sprint **/
			const currentSprintIssues = this.$store.getters['core/SPRINT_BY_ID_ISSUES_IDS'](sprintId)

			const handled = this.handleCommonRemoved(currentSprintIssues, event)
			const compositeSprintIds = {
				id: sprintId,
				issues: handled.list
			}

			this.showProgress()
			this.updateIssuesInSprint(compositeSprintIds)
				.then(() => this.updateIssuesOrdering(handled.ordering))
				.finally(() => this.hideProgress())
		},
		handleBacklogIssueRemoved (event, backlogId) {
			/** Handling removing from Backlog **/
			const currentBacklogIssues = this.$store.getters['core/BACKLOG'].issues

			const handled = this.handleCommonRemoved(currentBacklogIssues, event)
			const compositeBacklogIds = {
				id: backlogId,
				issues: handled.list
			}

			this.showProgress()
			this.updateIssuesInBacklog(compositeBacklogIds)
				.then(() => this.updateIssuesOrdering(handled.ordering))
				.finally(() => this.hideProgress())
		},
		handleDraggableEvent (event, dragType, dragId) {
			/** Handle dropping from Sprint/Backlog to Sprint/Backlog
       * This call can be called twice for any drag&drop
       * Object {
       *  removed: {
       *    element: {data},
       *    oldIndex: 0
       *  }
       * }
       *
       * * Object {
       *  added: {
       *    element: {data},
       *    newIndex: 0
       *  }
       * }
       * **/

			// Moving events block
			const isMovedInsideOfSprint = ('moved' in event) && (dragType === this.dragTypes.SPRINT)
			const isMovedInsideOfBacklog = ('moved' in event) && (dragType === this.dragTypes.BACKLOG)

			// Adding events block
			const isAddedToSprint = ('added' in event) && (dragType === this.dragTypes.SPRINT)
			const isAddedToBacklog = ('added' in event) && (dragType === this.dragTypes.BACKLOG)

			// Removing events block
			const isRemovedFromSprint = ('removed' in event) && (dragType === this.dragTypes.SPRINT)
			const isRemovedFromBacklog = ('removed' in event) && (dragType === this.dragTypes.BACKLOG)

			switch (true) {
			case isMovedInsideOfSprint:
				this.handleSprintIssueMoved(event, dragId)
				break
			case isMovedInsideOfBacklog:
				this.handleBacklogIssueMoved(event, dragId)
				break
			case isAddedToSprint:
				this.notifyAboutStartedSprintAffecting(event, dragId)
				this.handleSprintIssueAdded(event, dragId)
				break
			case isAddedToBacklog:
				this.handleBacklogIssueAdded(event, dragId)
				break
			case isRemovedFromSprint:
				this.notifyAboutStartedSprintAffecting(event, dragId)
				this.handleSprintIssueRemoved(event, dragId)
				break
			case isRemovedFromBacklog:
				this.handleBacklogIssueRemoved(event, dragId)
				break
			default:
				throw new Error('Unexpected dragging type')
			}
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
}
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
