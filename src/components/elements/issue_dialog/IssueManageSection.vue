<template>
	<q-card-section class="q-pt-none">
		<!-- Selection for issue state -->
		<q-select
			flat
			square
			dense
			:value="stateCategory"
			@input="updateIssueState($event)"
			:options="states"
			option-label="title"
			option-value="id"
		/>
		<!-- Selection for issue type -->
		<q-select
			flat
			square
			dense
			:value="typeCategory"
			@input="updateIssueType($event)"
			:options="types"
			option-label="title"
			option-value="id"
		/>
		<!-- Selection for assignee -->
		<q-select
			flat
			square
			dense
			:value="assignee"
			@input="updateIssueAssignee($event)"
			:options="participants"
			:option-label="(item) => `${item.first_name} ${item.last_name}`"
			option-value="id"
		/>
		<!-- Selection for story points -->
		<q-select
			flat
			square
			dense
			:value="estimationCategory"
			@input="updateIssueEstimation($event)"
			:options="estimations"
			:option-label="(item) => item ? `${item.title}`: 'None'"
			option-value="id"
		/>
	</q-card-section>
</template>

<script>
import { unWatch } from 'src/services/util'

export default {
	name: 'IssueManageSection',
	props: {
		issue: {
			type: Object,
			required: true
		}
	},
	data () {
		return {
			formIssue: unWatch(this.issue)
		}
	},
	methods: {
		async updateIssueState (state) {
			const payload = {
				id: this.issue.id,
				state_category: state.id
			}

			await this.$store.dispatch('core/PATCH_ISSUE', payload)
			this.$emit('update_state', payload)
		},
		async updateIssueType (state) {
			/** update Issue type
			 * we use it in selection field **/
			const payload = {
				id: this.issue.id,
				type_category: state.id
			}

			await this.$store.dispatch('core/PATCH_ISSUE', payload)
			this.$emit('update_type', payload)
		},
		async updateIssueAssignee (assignee) {
			/** update Issue assignee
			 * we use it in selection field **/
			const payload = {
				id: this.issue.id,
				assignee: assignee.id
			}

			await this.$store.dispatch('core/PATCH_ISSUE', payload)
			this.$emit('update_assignee', payload)
		},
		async updateIssueEstimation (estimation) {
			const payload = {
				id: this.issue.id,
				estimation_category: estimation.id
			}

			await this.$store.dispatch('core/PATCH_ISSUE', payload)
			this.$emit('update_estimation', payload)
		}
	},
	computed: {
		states () {
			return this.$store.getters['core/ISSUE_STATES_BY_CURRENT_PROJECT']
		},
		types () {
			return this.$store.getters['core/ISSUE_TYPES_BY_CURRENT_PROJECT']
		},
		participants () {
			return this.$store.getters['auth/PARTICIPANTS_BY_CURRENT_PROJECT']
		},
		estimations () {
			return this.$store.getters['core/ISSUE_ESTIMATIONS_BY_CURRENT_PROJECT']
		},
		stateCategory () {
			/** Get Issue state by Id, we got Issue State from props given to component **/
			return this.$store.getters['core/ISSUE_STATE_BY_ID'](this.issue.state_category)
		},
		typeCategory () {
			/** Get Issue Type by Id, we got Issue Types from props given to component **/
			return this.$store.getters['core/ISSUE_TYPE_BY_ID'](this.issue.type_category)
		},
		assignee () {
			/** Get participant object by given id from participants list given in props
			 * It also can return Unassigned if given person was not found **/

			if (this.issue.assignee === null) {
				return {
					id: null,
					first_name: 'Unassigned',
					last_name: ''
				}
			}

			return this.$store.getters['auth/PERSON_BY_ID'](this.issue.assignee)
		},
		estimationCategory () {
			/** Get estimation by id **/
			return this.$store.getters['core/ISSUE_ESTIMATION_BY_ID'](this.issue.estimation_category)
		}
	}
}
</script>
