<template>
  <q-page class="q-layout-padding overflow-hidden">
    <div v-if="startedSprint" class="fit">
      <!-- Row wrapper for block with Sprint information -->
      <div class="row full-width justify-between items-center q-pa-sm">
        <!-- Sprint name -->
        <div class="col-auto text-h5 text-accent">
          {{ startedSprint.title }}
        </div>
        <!-- Sprint goal -->
        <div
          v-if="$q.screen.gt.md && startedSprint.goal"
          class="col text-h6 text-secondary q-pl-md">
          [&nbsp;{{ startedSprint.goal }}&nbsp;]
        </div>
        <!-- Sprint remaining text -->
        <div
          v-if="$q.screen.gt.sm"
          class="col text-h6 small text-secondary text-right q-pr-md">
          <q-icon name="mdi-timer-sand"/>
          <span :title="sprintRange">&nbsp;{{ daysRemainingText }} </span>
        </div>
        <!-- Sprint manage buttons -->
        <div class="col-auto">
          <q-btn-group :outline="this.$q.screen.gt.sm">
            <StartCompleteSprintButton :sprint="startedSprint" size="md"/>
            <q-btn
              outline
							color="secondary"
              label="Edit sprint"
              class="xs-hide sm-hide"
              @click="editSprintDialog(startedSprint)"
            />
          </q-btn-group>
        </div>
      </div>
      <q-card
        square
        bordered
        class="q-mt-sm-none q-mt-md-md">
        <!-- Scroll for all columns -->
        <q-scroll-area
          visible
          ref="scrollArea"
          :class="`${$q.screen.lt.md ? 'q-pl-xs q-pr-sm': ''}`"
          style="height: calc(100vh - 160px);">
          <div :class="`fit ${ $q.screen.lt.md ? 'column' : 'row' }
            justify-start items-stretch content-center issue_state_column_list`">
            <!-- Issue state column -->
            <div
              v-for="state in issueStates"
              :key="state.id"
              class="col q-pa-xs full-width text-center">
              <!-- Printable HEAD of column -->
              <div class="q-py-xs text-accent text-center text-uppercase">
                {{ state.title }}
                <span>&nbsp;&nbsp;{{ issuesByStateAmount(state.id) }}</span>
                <q-icon v-if="state.is_done"
                        name="mdi-check"
                        color="positive"
                        class="q-ml-sm"/>
              </div>
              <!-- Issues block -->
              <div class="full-width full-height">
                <q-scroll-area
                  :delay="1200"
                  class="q-pl-xs q-pr-sm overflow-hidden"
                  :style="`${ $q.screen.lt.md ? 'height: 40vh' : 'height: 75vh'}`">
                  <draggable
                    :value="issuesByState(state.id)"
                    :handle="$q.screen.lt.sm ? '.handle' : false"
                    v-bind="dragOptions"
                    @change="handleIssueStateChanging($event, state.id)"
                    class="fit overflow-hidden-y no-scroll">

                    <transition-group
                      type="transition"
                      name="flip-list"
                      tag="div"
                      class="fit"
                      style="min-height: 37vh">
                      <IssueBoard
                        v-for="issue in issuesByState(state.id)"
                        :key="issue.id"
                        :issue="issue"/>
                    </transition-group>
                  </draggable>
                </q-scroll-area>
              </div>
            </div>
          </div>
        </q-scroll-area>
      </q-card>
    </div>
    <NoStartedSprintNotification v-else/>
  </q-page>
</template>

<script>
import NoStartedSprintNotification from 'components/elements/NoStartedSprintNotification.vue'

import StartCompleteSprintButton from 'components/buttons/StartCompleteSprintButton.vue'
import SprintEditDialog from 'components/dialogs/SprintEditDialog.vue'
import IssueEditDialog from 'components/dialogs/IssueEditDialog.vue'

import { unWatch } from 'src/services/util'
import { date } from 'quasar'
import draggable from 'vuedraggable'
import { SPRINT_REMAINING_UNIT, DATE_MASK } from 'src/services/masks'

import { editIssueData } from 'pages/mixins/editIssueData'
import { updateSprintMixin } from 'pages/mixins/updateSprint'

import IssueBoard from 'components/elements/IssueBoard.vue'
import { loading } from '../mixins/loading'

export default {
	name: 'BoardView',
	components: {
		NoStartedSprintNotification,
		StartCompleteSprintButton,
		// eslint-disable-next-line vue/no-unused-components
		IssueEditDialog,
		// eslint-disable-next-line vue/no-unused-components
		SprintEditDialog,
		IssueBoard,
		draggable
	},
	mixins: [
		updateSprintMixin,
		editIssueData,
		loading
	],
	data () {
		return {
			dragOptions: {
				animation: 200,
				group: 'issues',
				disabled: false,
				ghostClass: 'ghost'
			}
		}
	},
	computed: {
		startedSprint () {
			/** Return started sprint data is_started and not is_completed */
			return this.$store.getters['core/SPRINT_STARTED_BY_CURRENT_PROJECT']
		},
		sprintRange () {
			/** Return text dates like 10.10.2022 - 10.20.2022 */
			const startedAt = date.formatDate(this.startedSprint.started_at, DATE_MASK)
			const finishedAt = date.formatDate(this.startedSprint.finished_at, DATE_MASK)
			return `${startedAt} - ${finishedAt}`
		},
		daysAmount () {
			/** Days amount for the current SPrint
			 * We use it for calculating in daysRemainingText */
			return date.getDateDiff(
				this.startedSprint.finished_at,
				this.startedSprint.started_at,
				SPRINT_REMAINING_UNIT
			)
		},
		daysRemaining () {
			/** Days remaining till the end of Sprint
			 * We use it for calculating in daysRemainingText */
			return date.getDateDiff(
				this.startedSprint.finished_at,
				new Date(),
				SPRINT_REMAINING_UNIT
			)
		},
		daysRemainingText () {
			/** We use it to show ex: 10 days remaining */
			switch (true) {
			case this.daysRemaining > this.daysAmount:
				return 'Will start...'
			case this.daysRemaining > 0:
				return `${this.daysRemaining} days${this.$q.screen.gt.md ? ' remaining' : ''}`
			case this.daysRemaining < 0:
				return `0 days${this.$q.screen.gt.md ? ' remaining' : ''}`
			default:
				throw new Error('Unexpected days remaining value')
			}
		}
	},
	methods: {
		issuesByState (stateId) {
			return this.$store.getters['core/SPRINT_ISSUES_BY_CURRENT_PROJECT_AND_STATE_ID'](stateId)
		},
		issuesByStateAmount (stateId) {
			return this.issuesByState(stateId).length
		},
		handleIssueAdded (event, issueStateId) {
			/** Handling added in Issues State **/
			const updatedElement = unWatch(event.added.element)
			updatedElement.state_category = issueStateId

			this.showProgress()
			this.$store.dispatch('core/UPDATE_ISSUE_STATE', updatedElement)
				.finally(() => this.hideProgress())
		},
		handleCommonMoved (issuesList, event) {
			/** Handle moving - common function **/

			const immutableList = unWatch(issuesList)

			immutableList
				.splice(event.moved.newIndex, 0, immutableList
					.splice(event.moved.oldIndex, 1)[0])

			const ordering = []
			immutableList.forEach((issue, index) => {
				ordering.push(
					{
						id: issue.id,
						ordering: index
					}
				)
			})

			return { list: immutableList, ordering }
		},
		handleStateMoved (event, stateId) {
			/** Handling moving inside of state **/
			const issuesList = this.issuesByState(stateId)
			const handled = this.handleCommonMoved(issuesList, event)

			this.showProgress()
			this.$store.dispatch('core/UPDATE_ISSUES_ORDERING', handled.ordering)
				.finally(() => this.hideProgress())
		},
		handleIssueStateChanging (event, issueStateId) {
			/** Handling moving inside of states **/
			const isAdded = ('added' in event)
			const isRemoved = ('removed' in event)
			const isMoved = ('moved' in event)

			switch (true) {
			case isAdded:
				this.handleIssueAdded(event, issueStateId)
				break
			case isRemoved:
				break
			case isMoved:
				this.handleStateMoved(event, issueStateId)
				break
			default:
				throw new Error('This error should not occurred')
			}
		},
		editSprintDialog (item) {
			this.$q.dialog({
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
					this.$store.dispatch('core/EDIT_SPRINT', data)
						.finally(() => this.hideProgress())
				})
		}
	}
}
</script>
<style lang="scss">
.issue_state_column_list > div {
  min-height: 10vh!important;
}

.issue_state_column_list > div > div:first-child {
  font-size: 1rem;
  font-weight: 500;
  border-bottom: 1px solid #606060;
}
</style>
