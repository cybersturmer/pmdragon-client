import { waitFor } from 'src/services/util'

export const websocket = {
	methods: {
		unsubscribeIssuesInWorkspace () {
			/** Let's unsubscribe from previously subscribed workspace */
			const unsubscribePayload = {
				action: 'unsubscribe_from_issues_in_workspace',
				request_id: this.$store.getters['connection/SOCKET_REQUEST_ID'],
				workspace_pk: this.$store.getters['auth/WORKSPACE_ID']
			}

			this.$socket.sendObj({
				stream: 'workspace_issues',
				payload: unsubscribePayload
			})

			this.$store.commit('current/SET_ISSUE_IN_WORKSPACE_SUBSCRIBED', false)
		},
		subscribeIssuesInWorkspace () {
			/** And now let's subscribe issues from new Workspace */
			const workspaceId = this.$store.getters['auth/WORKSPACE_ID']
			const alreadySubscribed = this.$store.getters['current/ISSUE_IN_WORKSPACE_SUBSCRIBED']

			if (!workspaceId || alreadySubscribed) return false

			const subscribePayload = {
				action: 'subscribe_to_issues_in_workspace',
				request_id: this.$store.getters['connection/SOCKET_REQUEST_ID'],
				workspace_pk: this.$store.getters['auth/WORKSPACE_ID']
			}

			this.$socket.sendObj({
				stream: 'workspace_issues',
				payload: subscribePayload
			})

			this.$store.commit('current/SET_ISSUE_IN_WORKSPACE_SUBSCRIBED', true)
		},
		async subscribeIssueChat () {
			const currentIssue = this.$store.getters['current/ISSUE_ID']

			return await waitFor(
				this.$store.getters['connection/SOCKET_CONNECTED'],
				() => {
					this.$store.commit('connection/UPDATE_SOCKET_REQUEST_ID')

					const subscribePayload = {
						action: 'subscribe_to_messages_in_issue',
						request_id: this.$store.getters['connection/SOCKET_REQUEST_ID'],
						issue_pk: currentIssue
					}

					this.$socket.sendObj({
						stream: 'issue_chat',
						payload: subscribePayload
					})
				},
				100
			)
		},
		async unsubscribeIssueChat () {
			const currentIssue = this.$store.getters['current/ISSUE_ID']

			return await waitFor(
				this.$store.getters['connection/SOCKET_CONNECTED'],
				() => {
					this.$store.commit('connection/UPDATE_SOCKET_REQUEST_ID')
					const unsubscribePayload = {
						action: 'unsubscribe_from_messages_in_issue',
						request_id: this.$store.getters['connection/SOCKET_REQUEST_ID'],
						issue_pk: currentIssue
					}

					this.$socket.sendObj({
						stream: 'issue_chat',
						payload: unsubscribePayload
					})
				}
			)
		},
		subscribeSettings () {
			const workspaceId = this.$store.getters['auth/WORKSPACE_ID']
			const isMeOwner = this.$store.getters['auth/IS_ME_OWNER_OF_PROJECT']

			if (!workspaceId || isMeOwner) return false

			const list = [
				{
					action: 'subscribe_to_issue_type_categories_in_workspace',
					stream: 'workspace_issue_types'
				},
				{
					action: 'subscribe_to_issue_type_categories_icons_in_workspace',
					stream: 'workspace_issue_type_icons'
				},
				{
					action: 'subscribe_to_issue_state_categories_in_workspace',
					stream: 'workspace_issue_states'
				},
				{
					action: 'subscribe_to_issue_estimation_categories_in_workspace',
					stream: 'workspace_issue_estimations'
				}
			]

			for (const entry of list) {
				this.$store.dispatch('connection/UPDATE_REQUEST_ID').then(() => {})

				const payload = {
					action: entry.action,
					request_id: this.$store.getters['connection/SOCKET_REQUEST_ID'],
					workspace_pk: this.$store.getters['auth/WORKSPACE_ID']
				}

				this.$socket.sendObj({
					stream: entry.stream,
					payload: payload
				})
			}
		},
		unsubscribeSettings () {
			const workspaceId = this.$store.getters['auth/WORKSPACE_ID']
			const isMeOwner = this.$store.getters['auth/IS_ME_OWNER_OF_PROJECT']

			if (!workspaceId || isMeOwner) return false

			const list = [
				{
					action: 'unsubscribe_from_issue_type_categories_in_workspace',
					stream: 'workspace_issue_types'
				},
				{
					action: 'unsubscribe_from_issue_type_categories_icons_in_workspace',
					stream: 'workspace_issue_type_icons'
				},
				{
					action: 'unsubscribe_from_issue_state_categories_in_workspace',
					stream: 'workspace_issue_states'
				},
				{
					action: 'unsubscribe_from_issue_estimation_categories_in_workspace',
					stream: 'workspace_issue_estimations'
				}
			]

			for (const entry of list) {
				this.$store.dispatch('connection/UPDATE_REQUEST_ID').then(() => {})

				const payload = {
					action: entry.action,
					request_id: this.$store.getters['connection/SOCKET_REQUEST_ID'],
					workspace_pk: this.$store.getters['auth/WORKSPACE_ID']
				}

				this.$socket.sendObj({
					stream: entry.stream,
					payload: payload
				})
			}
		}
	},
	watch: {
		connected (newValue, oldValue) {
			/** Let's subscribe issues only if we connected to server */
			if (oldValue || !newValue) return null

			this.subscribeIssuesInWorkspace()
			this.subscribeSettings()
		}
	},
	computed: {
		issuesInWorkspaceSubscribed () {
			return this.$store.getters['current/ISSUE_IN_WORKSPACE_SUBSCRIBED']
		},
		connected () {
			return this.$store.getters['connection/SOCKET_CONNECTED']
		}
	}
}
