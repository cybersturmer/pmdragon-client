<script>
import { defineComponent } from 'vue'

import DraggableIssueBacklogCollection from 'components/elements/backlog/interface/DraggableIssueBacklogCollection'

export default defineComponent({
	name: 'DraggableBacklogIssues',
	extends: DraggableIssueBacklogCollection,
	computed: {
		issues: {
			get () {
				return this.$store.getters['core/BACKLOG_ISSUES']
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

				const updatePayload = {
					id: this.collectionId,
					issues: issuesIds
				}

				await Promise.all([
					this.updateIssuesInBacklog(updatePayload),
					this.updateIssuesOrdering(issuesOrdering)
				])
			}
		}
	}
})
</script>
