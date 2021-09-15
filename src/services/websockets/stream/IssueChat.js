import { StreamBase } from 'src/services/websockets/stream/base/StreamBase'

export class IssueChat extends StreamBase {
	async onCreate (message) {
		await this.$store.dispatch('current/ADD_ISSUE_MESSAGE', message)
	}

	async onUpdate (message) {
		await this.$store.dispatch('current/UPDATE_ISSUE_MESSAGE', message)
	}

	async onDelete (message) {
		await this.$store.dispatch('current/REMOVE_ISSUE_MESSAGE', message)
	}
}
