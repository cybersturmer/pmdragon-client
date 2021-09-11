import { StreamBase } from 'src/services/websockets/stream/base/StreamBase'

export class IssueInWorkspace extends StreamBase {
	onCreate (message) {
		this.$store.commit('core/ADD_ISSUE_TO_ISSUES', message)
	}

	onUpdate (message) {
		this.$store.commit('core/UPDATE_ISSUE', message)
	}

	onDelete (message) {
		this.$store.commit('core/DELETE_ISSUE', message)
	}
}
