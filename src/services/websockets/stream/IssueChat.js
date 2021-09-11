import { StreamBase } from 'src/services/websockets/stream/base/StreamBase'

export class IssueChat extends StreamBase {
	onCreate (message) {
		this.$store.commit('current/ADD_ISSUE_MESSAGE', message)
	}

	onUpdate (message) {
		this.$store.commit('current/UPDATE_ISSUE_MESSAGE', message)
	}

	onDelete (message) {
		this.$store.commit('current/DELETE_ISSUE_MESSAGE', message)
	}
}
