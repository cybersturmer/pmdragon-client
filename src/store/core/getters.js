function sortIssuesByOrdering (a, b) {
	return a.ordering - b.ordering
}

export function BACKLOGS (state) {
	return state.backlogs
}

export function SPRINTS (state) {
	return state.sprints
}

export function ISSUES (state) {
	return state.issues
}

/** Issues Block **/
export function ISSUE_BY_ID (state) {
	/** Getting issue from main list by id **/
	return issueId => {
		return state.issues.find(issue => issue.id === parseInt(issueId))
	}
}

export function IS_ISSUE_EXISTS_BY_ID (state, getters) {
	return issueId => {
		try {
			return !!getters.ISSUE_BY_ID(issueId)
		} catch (e) {
			return false
		}
	}
}

export function ISSUE_BY_ID_PROJECT_NUMBER (state, getters) {
	/** Getting project number by issue id **/
	return issueId => {
		try {
			return getters.ISSUE_BY_ID(issueId).project_number
		} catch (e) {
			return null
		}
	}
}

export function ISSUE_BY_ID_ATTACHMENTS (state, getters) {
	return issueId => {
		try {
			return getters.ISSUE_BY_ID(issueId).attachments
		} catch (e) {
			return []
		}
	}
}

export function ISSUES_BY_IDS (state) {
	return issuesIds => {
		return state.issues
			.filter((issue) => issuesIds.indexOf(issue.id) >= 0)
	}
}

/** ATTACHMENTS block **/

export function ATTACHMENTS_BY_CURRENT_PROJECT (state, getters, rootState, rootGetters) {
	return state.issue_attachments
		.filter((attachment) => attachment.project === rootGetters['current/PROJECT'])
}

export function ATTACHMENT_BY_ID (state) {
	return attachmentId => {
		return state.issue_attachments
			.find(attachment => attachment.id === attachmentId)
	}
}

export function ATTACHMENTS_BY_IDS (state) {
	return attachmentIds => {
		return state.issue_attachments
			.filter((attachment) => attachmentIds.indexOf(attachment.id) >= 0)
	}
}

/** Sprints block **/
export function SPRINTS_BY_CURRENT_PROJECT (state, getters, rootState, rootGetters) {
	return state.sprints
		.filter((sprint) => sprint.project === rootGetters['current/PROJECT'])
}

export function SPRINT_STARTED_BY_CURRENT_PROJECT (state, getters, rootState, rootGetters) {
	/** Get current sprint
   * For current project
   * Started
   * Not completed **/
	try {
		return state.sprints
			.find(sprint =>
				sprint.project === rootGetters['current/PROJECT'] &&
        sprint.is_started &&
        !sprint.is_completed)
	} catch (e) {
		return null
	}
}

export function SPRINT_STARTED_BY_CURRENT_PROJECT_ISSUES (state, getters) {
	try {
		return getters.ISSUES_BY_IDS(getters.SPRINT_STARTED_BY_CURRENT_PROJECT.issues)
	} catch (e) {
		return []
	}
}

export function SPRINT_ISSUES_BY_CURRENT_PROJECT_AND_STATE_ID (state, getters) {
	return issuesState => {
		return getters.SPRINT_STARTED_BY_CURRENT_PROJECT_ISSUES
			.filter((issue) => issue.state_category === issuesState)
	}
}

export function STORY_POINT_TOTAL_FOR_STARTED_SPRINT (state, getters) {
	try {
		const issues = getters.SPRINT_STARTED_BY_CURRENT_PROJECT_ISSUES
		let totalStoryPoints = 0
		for (const issue of issues) {
			const isEstimation = Number.isInteger(issue.estimation_category)
			if (!isEstimation) continue
			totalStoryPoints += getters.ISSUE_ESTIMATION_BY_ID(issue.estimation_category).value
		}
		return totalStoryPoints
	} catch (e) {
		return 0
	}
}

export function STORY_POINT_DONE_FOR_STARTED_SPRINT (state, getters) {
	try {
		const doneIssueState = state.issue_states
			.find(issueState => issueState.is_done === true)

		const issues = getters.SPRINT_STARTED_BY_CURRENT_PROJECT_ISSUES
			.filter((issue) => issue.state_category === doneIssueState.id)

		let doneStoryPoints = 0
		for (const issue of issues) {
			const isEstimation = Number.isInteger(issue.estimation_category)
			if (!isEstimation) continue
			doneStoryPoints += getters.ISSUE_ESTIMATION_BY_ID(issue.estimation_category).value
		}

		return doneStoryPoints
	} catch (e) {
		return 0
	}
}

export function PROJECT_SPRINTS (state, getters, rootState, rootGetters) {
	try {
		return state.sprints
			.filter((sprint) => sprint.project === rootGetters['current/PROJECT'])
	} catch (e) {
		return null
	}
}

export function UNCOMPLETED_PROJECT_SPRINTS (state, getters) {
	try {
		return getters.PROJECT_SPRINTS.filter((sprint) => sprint.is_completed === false)
	} catch (e) {
		return null
	}
}

export function SPRINT_BY_ID (state) {
	return sprintId => state.sprints.find(sprint => sprint.id === sprintId)
}

export function SPRINT_STARTED_BUT_NOT_COMPLETED_BY_CURRENT_PROJECT (state, getters, rootState, rootGetters) {
	try {
		return state.sprints.find(sprint =>
			sprint.project === rootGetters['current/PROJECT'] &&
			sprint.is_started === true &&
			sprint.is_completed === false)
	} catch (e) {
		return null
	}
}

export function IS_SPRINT_STARTED_BY_ID (state, getters) {
	return sprintId => getters.SPRINT_BY_ID(sprintId).is_started
}

export function SPRINT_BY_ID_ISSUES_IDS (state, getters) {
	return sprintId => {
		return getters.SPRINT_BY_ID(sprintId).issues
	}
}

export function SPRINT_BY_ID_ISSUES (state, getters) {
	return sprintId => {
		return getters.ISSUES_BY_IDS(getters.SPRINT_BY_ID(sprintId).issues)
	}
}

export function SPRINT_BY_ID_ISSUES_SORTED_BY_ORDERING (state, getters) {
	return sprintId => {
		return getters.SPRINT_BY_ID_ISSUES(sprintId)
			.sort(sortIssuesByOrdering)
	}
}

/** Issue States Block **/
export function ISSUE_STATES_BY_CURRENT_PROJECT (state, getters, rootState, rootGetters) {
	return state.issue_states
		.filter((issueState) => issueState.project === rootGetters['current/PROJECT'])
}

export function IS_ISSUE_STATE_DONE (state) {
	return issueStateId => {
		try {
			return state.issue_states
				.find(issueState => issueState.id === issueStateId).is_done
		} catch (e) {
			return false
		}
	}
}

export function ISSUE_STATE_BY_ID (state) {
	return issueStateId => {
		try {
			return state.issue_states
				.find(issueState => issueState.id === issueStateId)
		} catch (e) {
			return null
		}
	}
}

export function ISSUE_STATE_TITLE_BY_ID (state, getters) {
	return issueStateId => {
		if (!issueStateId) return false
		return getters.ISSUE_STATE_BY_ID(issueStateId).title
	}
}

export function ISSUE_STATE_BY_DEFAULT (state, getters, rootState, rootGetters) {
	return state.issue_states
		.find(stateCategory => stateCategory.is_default === true &&
      stateCategory.project === rootGetters['current/PROJECT'])
}

export function IS_STATE_CATEGORY_BY_DEFAULT (state, getters) {
	return !!getters.ISSUE_STATE_BY_DEFAULT
}

/** Issue Types Block **/

export function ISSUE_TYPES_BY_CURRENT_PROJECT (state, getters, rootState, rootGetters) {
	return state.issue_types
		.filter((issueType) => issueType.project === rootGetters['current/PROJECT'])
}

export function ISSUE_TYPE_ICONS (state) {
	return state.issue_type_icons
}

export function ISSUE_TYPES_ICONS_BY_CURRENT_PROJECT (state, getters, rootState, rootGetters) {
	return state.issue_type_icons
		.filter((issueTypesIcons) => issueTypesIcons.project === rootGetters['current/PROJECT'])
}

export function ISSUE_TYPE_ICON_BY_ID (state) {
	return iconId => {
		return state.issue_type_icons
			.find(typeIcon => typeIcon.id === iconId)
	}
}

export function ISSUE_TYPE_ICON_BY_ISSUE_TYPE_CATEGORY_ID (state, getters, rootState, rootGetters) {
	return (issueTypeCategoryId) => {
		const issueType = state.issue_types
			.find(typeCategory => typeCategory.id === issueTypeCategoryId &&
        typeCategory.project === rootGetters['current/PROJECT'])

		if (!issueType || !issueType.icon) return null

		return state.issue_type_icons
			.find(typeIcon => typeIcon.id === issueType.icon)
	}
}

export function ISSUE_TYPE_BY_ID (state, getters, rootState, rootGetters) {
	return issueTypeId => {
		try {
			return state.issue_types
				.find(typeCategory => typeCategory.id === issueTypeId &&
          typeCategory.project === rootGetters['current/PROJECT'])
		} catch (e) {
			return null
		}
	}
}

export function ISSUE_TYPE_BY_DEFAULT (state, getters, rootState, rootGetters) {
	return state.issue_types
		.find(typeCategory => typeCategory.is_default === true &&
      typeCategory.project === rootGetters['current/PROJECT'])
}

export function IS_TYPE_CATEGORY_BY_DEFAULT (state, getters) {
	return !!getters.ISSUE_TYPE_BY_DEFAULT
}

export function ISSUE_TYPE_TITLE_BY_ID (state, getters) {
	return issueTypeId => {
		if (!issueTypeId) return false
		try {
			return getters.ISSUE_TYPE_BY_ID(issueTypeId).title
		} catch (e) {
			return 'None'
		}
	}
}

export function ISSUE_TYPE_LABEL_BY_ID (state, getters) {
	return issueTypeId => {
		return `#${this.issue.project_number} ${getters.ISSUE_TYPE_TITLE_BY_ID(issueTypeId)}`
	}
}

export function ISSUE_TYPE_BY_ID_ICON (state, getters) {
	return issueTypeId => getters.ISSUE_TYPE_BY_ID(issueTypeId).icon
}

export function IS_ISSUE_TYPE_HAVE_ICON (state) {
	return issueTypeId => {
		try {
			const issueType = state.issue_types
				.find(issueType => issueType.id === issueTypeId)

			return !!issueType.icon
		} catch (e) {
			return false
		}
	}
}

export function ISSUE_ESTIMATIONS_BY_CURRENT_PROJECT (state, getters, rootState, rootGetters) {
	return state.issue_estimations
		.filter((issueEstimation) => issueEstimation.project === rootGetters['current/PROJECT'])
}

export function ISSUE_ESTIMATION_BY_ID (state) {
	return issueEstimationId => {
		if (issueEstimationId === null) return false

		try {
			return state.issue_estimations
				.find(issueEstimation => issueEstimation.id === issueEstimationId)
		} catch (e) {
			return null
		}
	}
}

export function WORKSPACE_SPRINT_DURATION (state, getters, rootState, rootGetters) {
	return state.sprint_durations
		.filter((sprintDuration) => sprintDuration.workspace === rootGetters['current/WORKSPACE_ID'])
}

export function BACKLOG (state, getters, rootState, rootGetters) {
	try {
		return state.backlogs
			.filter((backlog) => backlog.project_id === rootGetters['current/PROJECT'])[0]
	} catch (e) {
		return null
	}
}

export function BACKLOG_ISSUES_IDS (state, getters) {
	try {
		return getters.BACKLOG.issues
	} catch (e) {
		return []
	}
}

export function BACKLOG_ISSUES (state, getters) {
	try {
		return getters.ISSUES_BY_IDS(getters.BACKLOG.issues)
	} catch (e) {
		return []
	}
}

export function BACKLOG_ISSUES_SORTED_BY_ORDERING (state, getters) {
	try {
		return getters.BACKLOG_ISSUES.sort(sortIssuesByOrdering)
	} catch (e) {
		return []
	}
}

export function BACKLOG_ISSUES_COUNT (state, getters) {
	try {
		return getters.BACKLOG.issues.length
	} catch (e) {
		return 0
	}
}

export function IS_BACKLOG_EMPTY (state, getters) {
	try {
		return getters.BACKLOG.issues.length < 1
	} catch (e) {
		return true
	}
}
