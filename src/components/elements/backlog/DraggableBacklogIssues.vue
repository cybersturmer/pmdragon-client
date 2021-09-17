<script>
import { defineComponent } from 'vue'

import DraggableIssueBacklogCollection from 'components/elements/backlog/interface/DraggableIssueBacklogCollection'

export default defineComponent({
	name: 'DraggableBacklogIssues',
	extends: DraggableIssueBacklogCollection,
	computed: {
		issues: {
			get () {
				return this.$store.getters['core/BACKLOG_ISSUES_SORTED_BY_ORDERING']
			},
			async set (value) {
				const issuesIds = []

				for (const issue of value) {
					issuesIds.push(issue.id)
				}

				const backlogUpdatePayload = {
					id: this.collectionId,
					issues: issuesIds
				}

				await this.updateIssuesInBacklog(backlogUpdatePayload)
			}
		}
	}
})
</script>
