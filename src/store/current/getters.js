export function IS_DARK (state) {
	return state.dark
}

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
	try {
		return rootGetters['core/ISSUE_BY_ID'](getters.ISSUE_ID)
	} catch (e) {
		return null
	}
}

export function ISSUE_MESSAGES (state) {
	return state.issue_messages
}

export function ISSUE_MESSAGE_BY_ID (state) {
	/** Return issue message by id
	 * Messages normally loaded to state only when we start to edit issue,
	 * for example we can do it in separate modal window
	 * We also load already packed messages
	 * **/
	return issueMessageId => {
		const messagePack = state.issue_messages
			.find(({ list }) => list.find((message) => message.id === issueMessageId))

		return messagePack.list.find(message => message.id === issueMessageId)
	}
}

export function ARE_ISSUE_MESSAGES (state) {
	try {
		return state.issue_messages.length > 0
	} catch (e) {
		return false
	}
}

export function ISSUE_HISTORY (state) {
	return state.issue_history
}

export function SPRINT_GUIDELINE (state) {
	return state.sprint_guideline
}

export function SPRINT_GUIDELINE_TIMESERIES (state) {
	const guidelineValues = []

	for (const datum of state.sprint_guideline) {
		guidelineValues.push({
			x: datum?.time,
			y: datum?.story_points
		})
	}

	return guidelineValues
}

export function SPRINT_REMAINING (state) {
	return state.sprint_remaining
}

export function SPRINT_REMAINING_TIMESERIES (state) {
	const remainingValues = []

	for (const datum of state.sprint_remaining) {
		remainingValues.push({
			x: datum?.point_at,
			y: datum?.estimated_value
		})
	}

	return remainingValues
}

export function ISSUE_IN_WORKSPACE_SUBSCRIBED (state) {
	return state.issue_in_workspace_subscribed
}
