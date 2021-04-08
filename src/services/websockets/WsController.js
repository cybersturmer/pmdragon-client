import { IssueChat } from 'src/services/websockets/stream/IssueChat'
import { IssueInWorkspace } from 'src/services/websockets/stream/IssueInWorkspace'

export class WsController {
	constructor () {
		this.streamMapping = {
			issue_chat: IssueChat,
			workspace_issues: IssueInWorkspace
		}
	}

	processEvent (event) {
		const data = JSON.parse(event.data)
		const stream = data.stream
		const payload = data.payload

		const Controller = this.streamMapping[stream]
		if (!Controller) {
			throw Error('Undefined stream handler.')
		}

		const controllerInstance = new Controller()
		controllerInstance.processPayload(payload)
	}
}
