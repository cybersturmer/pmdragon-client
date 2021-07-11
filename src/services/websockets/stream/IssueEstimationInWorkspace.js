import $store from 'src/store'
import { StreamBase } from 'src/services/websockets/stream/base/StreamBase'

export class IssueEstimationInWorkspace extends StreamBase {
	init () {
		$store.dispatch('core/INIT_ISSUE_ESTIMATIONS')
			.then(() => {})
	}

	onCreate (message) {
		this.init()
	}

	onUpdate (message) {
		this.init()
	}

	onDelete (message) {
		this.init()
	}
}
