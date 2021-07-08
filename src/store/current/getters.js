export function WORKSPACE (state) {
	return state.workspace
}

export function IS_WORKSPACE (state) {
	return Boolean(state.workspace)
}

export function PROJECT (state) {
	return state.project
}

export function IS_SPACE_DEFINED (state) {
	return Boolean(state.workspace && state.project)
}

export function LOADING (state) {
	return !!state.loading
}

export function LOADING_TEXT (state) {
	if (!state.loading_module) return ''

	return `Loading ${state.loading_module}...`
}

export function ISSUE_ID (state) {
	return state.issue_id
}

export function ISSUE (state, getters, rootState, rootGetters) {
	return rootGetters['core/ISSUE_BY_ID'](getters.ISSUE_ID)
}

export function ISSUE_MESSAGES (state) {
	return state.issue_messages
}

export function ISSUE_MESSAGE_BY_ID (state) {
	/** Return issue message by id
	 * Messages normally loaded to state only when we start to edit issue,
	 * for example we can do it in separate modal window **/
	return issueMessageId => {
		return state.issue_messages.find(message => message.id === issueMessageId)
	}
}

export function ARE_ISSUE_MESSAGES (state) {
	return state.issue_messages.length > 0
}

export function ISSUE_HISTORY (state) {
	return state.issue_history
}

export function ISSUE_IN_WORKSPACE_SUBSCRIBED (state) {
	return state.issue_in_workspace_subscribed
}
