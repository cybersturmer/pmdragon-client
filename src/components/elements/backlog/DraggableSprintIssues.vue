<script>
import { defineComponent } from 'vue'
import DraggableIssueBacklogCollection from 'components/elements/backlog/interface/DraggableIssueBacklogCollection'
import { Dialogs } from 'pages/mixins/dialogs'

export default defineComponent({
	name: 'DraggableSprintIssues',
	extends: DraggableIssueBacklogCollection,
	mixins: [
		Dialogs
	],
	computed: {
		sprint () {
			return this.$store.getters['core/SPRINT_BY_ID'](this.collectionId)
		},
		issues: {
			get () {
				return this.$store.getters['core/SPRINT_BY_ID_ISSUES_SORTED_BY_ORDERING'](this.collectionId)
			},
			async set (value) {
				const issuesIds = []

				for (const issue of value) {
					issuesIds.push(issue.id)
				}

				const sprintUpdatePayload = {
					id: this.collectionId,
					issues: issuesIds
				}

				await this.updateIssuesInSprint(sprintUpdatePayload)
			}
		}
	},
	methods: {
		onChangeHandler (event) {
			this.notifyIfSprintStarted(event)
		},
		notifyIfSprintStarted (event) {
			/** Notify if someone start to put core in already started sprint or take it from **/
			if (!this.sprint.is_started || 'moved' in event) return false

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
				`By ${actionText} <strong>[ #${droppedIssue.id} - ${droppedIssue.title} ]</strong> you affect already started Sprint.`,
				true
			]

			this.showOkDialog(...dialog)
		}
	}
})
</script>
