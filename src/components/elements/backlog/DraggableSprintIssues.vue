<script>
import DraggableIssueBacklogCollection from 'components/elements/backlog/interface/DraggableIssueBacklogCollection'

export default {
	name: 'DraggableSprintIssues',
	extends: DraggableIssueBacklogCollection,
	computed: {
		issues: {
			get () {
				return this.$store.getters['core/SPRINT_BY_ID_ISSUES'](this.collectionId)
			},
			async set (value) {
				const issuesIds = []
				const issuesOrdering = []

				for (const [index, issue] of value.entries()) {
					issuesIds.push(issue.id)
					issuesOrdering.push({
						id: issue.id,
						ordering: index
					})
				}

				const sprintUpdatePayload = {
					id: this.collectionId,
					issues: issuesIds
				}

				await Promise.all([
					this.updateIssuesInSprint(sprintUpdatePayload),
					this.updateIssuesOrdering(issuesOrdering)
				])
			}
		}
	}
}
</script>
