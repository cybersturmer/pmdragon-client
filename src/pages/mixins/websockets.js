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
		}
	},
	watch: {
		connected (newValue, oldValue) {
			/** Let's subscribe issues only if we connected to server */
			if (oldValue || !newValue) return null

			this.subscribeIssuesInWorkspace()
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
