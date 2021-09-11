import { IssueChat } from 'src/services/websockets/stream/IssueChat'
import { IssueInWorkspace } from 'src/services/websockets/stream/IssueInWorkspace'
import { IssueTypeInWorkspace } from './stream/IssueTypeInWorkspace'
import { IssueTypeIconInWorkspace } from './stream/IssueTypeIconInWorkspace'
import { IssueStateInWorkspace } from './stream/IssueStateInWorkspace'
import { IssueEstimationInWorkspace } from './stream/IssueEstimationInWorkspace'

export class WsController {
	constructor (proxy) {
		this.streamMapping = {
			issue_chat: {
				controller: IssueChat
			},
			workspace_issues: {
				controller: IssueInWorkspace
			},
			workspace_issue_types: {
				controller: IssueTypeInWorkspace,
				callbacks: {
					onCreate: proxy.getIssueTypes,
					onUpdate: proxy.getIssueTypes,
					onDelete: proxy.getIssueTypes
				}
			},
			workspace_issue_type_icons: {
				controller: IssueTypeIconInWorkspace,
				callbacks: {
					onCreate: proxy.getIssueTypeIcons,
					onUpdate: proxy.getIssueTypeIcons,
					onDelete: proxy.getIssueTypeIcons
				}
			},
			workspace_issue_states: {
				controller: IssueStateInWorkspace,
				callbacks: {
					onCreate: proxy.getIssueStates,
					onUpdate: proxy.getIssueStates,
					onDelete: proxy.getIssueStates
				}
			},
			workspace_issue_estimation: {
				controller: IssueEstimationInWorkspace,
				callbacks: {
					onCreate: proxy.getIssueEstimations,
					onUpdate: proxy.getIssueEstimations,
					onDelete: proxy.getIssueEstimations
				}
			}
		}

		this.proxy = proxy
	}

	async processEvent (event) {
		/** We use this ti create own
		 * controller for event from server */
		const data = JSON.parse(event.data)

		try {
			const streamHandler = this.streamMapping[data.stream]

			const Controller = streamHandler.controller

			const controller = new Controller(
				this.proxy,
				streamHandler?.callbacks
			)

			const result = controller.processPayload(data.payload)

			if (streamHandler?.callbacks) {
				switch (result) {
				case 'created':
					return await streamHandler.callbacks.onCreate()
				case 'updated':
					return await streamHandler.callbacks.onUpdate()
				case 'deleted':
					return await streamHandler.callbacks.onDelete()
				}
			}
		} catch (e) {
			console.log(e)
			throw Error('Undefined stream handler.')
		}
	}
}
