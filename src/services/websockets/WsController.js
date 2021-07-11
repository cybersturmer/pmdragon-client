import { IssueChat } from 'src/services/websockets/stream/IssueChat'
import { IssueInWorkspace } from 'src/services/websockets/stream/IssueInWorkspace'
import { IssueTypeInWorkspace } from './stream/IssueTypeInWorkspace'
import { IssueTypeIconInWorkspace } from './stream/IssueTypeIconInWorkspace'
import { IssueStateInWorkspace } from './stream/IssueStateInWorkspace'
import { IssueEstimationInWorkspace } from './stream/IssueEstimationInWorkspace'

export class WsController {
	constructor () {
		this.streamMapping = {
			issue_chat: IssueChat, // messages in Issue
			workspace_issues: IssueInWorkspace, // issues in Workspace
			workspace_issue_types: IssueTypeInWorkspace, // issue types in Workspace
			workspace_issue_type_icons: IssueTypeIconInWorkspace, // issue types icons in Workspace
			workspace_issue_states: IssueStateInWorkspace, // issue state in workspace
			workspace_issue_estimation: IssueEstimationInWorkspace // issue estimation in workspace
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
