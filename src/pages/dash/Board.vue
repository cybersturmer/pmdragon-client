<template>
  <q-page class="q-layout-padding overflow-hidden">
    <div v-if="startedSprint" class="fit">
      <!-- Row wrapper for block with Sprint information -->
      <div class="row full-width justify-between items-center q-pa-sm">
        <!-- Sprint name -->
				<BlockHeaderInfo :title="startedSprint.title"
												 :info="$q.screen.gt.md && startedSprint.goal ? startedSprint.goal : undefined "/>
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
        :class="`q-mt-sm-none q-mt-md-md ${ $q.dark.isActive ? 'bg-grey-10' : '' }`">
        <!-- Scroll for all columns -->
        <q-scroll-area
          visible
          ref="scrollArea"
          :class="`${$q.screen.lt.md ? 'q-pl-xs q-pr-sm': ''}`"
          style="height: calc(100vh - 11em);">
          <div :class="`fit ${ $q.screen.lt.md ? 'column' : 'row' }
            justify-start items-stretch content-center issue_state_column_list`">
            <!-- Issue state column -->
            <div
              v-for="state in issueStates"
              :key="state.id"
              class="col q-pa-xs full-width text-center">
              <!-- Printable HEAD of column -->
              <div class="q-py-xs text-center text-uppercase">
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
                  :style="`${ $q.screen.lt.md ? 'height: 40vh' : 'height: 75vh'}`">
                  <draggable
                    :modelValue="issuesByState(state.id)"
                    v-bind="dragOptions"
										@start="dragging=true"
										@end="dragging=false"
										:class="`${dragging ? 'drag_to_point_highlighter' : '' }`"
                    @change="handleIssueStateChanging($event, state.id)">
										<template #item="{ element }">
											<IssueBoard :issue="element"/>
										</template>
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
import { defineComponent } from 'vue'

import { date } from 'quasar'
import { SPRINT_REMAINING_UNIT, DATE_MASK } from 'src/services/masks'
import draggable from 'vuedraggable'
import { loading } from 'src/pages/mixins/loading'
import { editIssueData } from 'src/pages/mixins/editIssueData'
import { CoreActionsMixin } from 'src/services/actions/core'

import NoStartedSprintNotification from 'src/components/elements/NoStartedSprintNotification'
import StartCompleteSprintButton from 'src/components/buttons/StartCompleteSprintButton'
import SprintEditDialog from 'src/components/dialogs/SprintEditDialog'
import IssueEditDialog from 'src/components/dialogs/IssueEditDialog'
import { sortByOrdering, unWatch } from 'src/services/util'
import IssueBoard from 'src/components/elements/IssueBoard'
import BlockHeaderInfo from 'src/components/elements/BlockHeaderInfo'

export default defineComponent({
	name: 'BoardView',
	components: {
		BlockHeaderInfo,
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
		CoreActionsMixin,
		editIssueData,
		loading
	],
	data () {
		return {
			dragging: false,
			dragOptions: {
				animation: 200,
				group: 'issues',
				itemKey: 'id',
				disabled: false,
				ghostClass: 'ghost',
				'component-data': {
					name: 'fade'
				},
				handle: this.$q.screen.lt.sm ? '.handle' : false
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
			case this.daysRemaining <= 0:
				return `0 days${this.$q.screen.gt.md ? ' remaining' : ''}`
			default:
				throw new Error('Unexpected days remaining value')
			}
		}
	},
	methods: {
		issuesByState (stateId) {
			return unWatch(this.$store.getters['core/SPRINT_ISSUES_BY_CURRENT_PROJECT_AND_STATE_ID'](stateId))
				.sort(sortByOrdering)
		},
		issuesByStateAmount (stateId) {
			return this.issuesByState(stateId).length
		},
		handleIssueAdded (event, issueStateId) {
			/** Handling added in Issues State **/
			const updatedElement = unWatch(event.added.element)
			updatedElement.state_category = issueStateId

			this.showProgress()
			this.updateIssueState(updatedElement)
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
			this.updateIssuesOrdering(handled.ordering)
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
				componentProps: {
					id: item.id,
					title: item.title,
					goal: item.goal,
					startedAt: item.started_at,
					finishedAt: item.finished_at
				}
			})
				.onOk((data) => {
					this.showProgress()
					this.editSprint(data)
						.finally(() => this.hideProgress())
				})
		}
	}
})
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
