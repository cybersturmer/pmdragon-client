import $store from 'src/store'
import { StreamBase } from 'src/services/websockets/stream/base/StreamBase'

export class IssueChat extends StreamBase {
	onCreate (message) {
		$store.commit('current/ADD_ISSUE_MESSAGE', message)
	}

	onUpdate (message) {
		$store.commit('current/UPDATE_ISSUE_MESSAGE', message)
	}

	onDelete (message) {
		$store.commit('current/DELETE_ISSUE_MESSAGE', message)
	}
}
