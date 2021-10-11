import { LocalStorage } from 'quasar'
import { removeElement, removeElementById, syncPair, updateElementById } from 'src/services/util'
import { empty } from './presets'

function findBacklogByProjectId (state, projectId) {
	return state.backlogs
		.findIndex((el, index, array) => {
			return el.project_id === projectId
		})
}

function findSprintIndexById (state, sprintId) {
	return state.sprints
		.findIndex((el, index, array) => {
			return el.id === sprintId
		})
}

// eslint-disable-next-line no-unused-vars
function findBacklogIndexById (state, backlogId) {
	return state.backlogs
		.findIndex((el, index, array) => {
			return el.id === backlogId
		})
}

export function ACTIVATE (state) {
	state.enabled = true
	LocalStorage.set('core.enabled', true)
}

export function UPDATE_BACKLOGS (state, payload) {
	state.backlogs = payload
	LocalStorage.set('core.backlogs', payload)
}

export function UPDATE_SPRINTS (state, payload) {
	state.sprints = payload
	LocalStorage.set('core.sprints', payload)
}

export function UPDATE_ISSUES (state, payload) {
	state.issues = payload
	LocalStorage.set('core.issues', payload)
}

export function UPDATE_ATTACHMENTS (state, payload) {
	state.issue_attachments = payload
	LocalStorage.set('core.issue_attachments', payload)
}

export function UPDATE_SPRINT_DURATIONS (state, payload) {
	state.sprint_durations = payload
	LocalStorage.set('core.sprint_durations', payload)
}

export function UPDATE_WORKING_DAYS (state, payload) {
	state.working_days = payload
	LocalStorage.set('core.working_days', payload)
}

export function UPDATE_WORKING_DAYS_SETTING (state, payload) {
	updateElementById(state.working_days, payload)
	LocalStorage.set('core.working_days', state.working_days)
}

export function UPDATE_NON_WORKING_DAYS (state, payload) {
	state.non_working_days = payload
	LocalStorage.set('core.non_working_days', state.non_working_days)
}

export function ADD_NON_WORKING_DAY (state, payload) {
	state.non_working_days.push(payload)
	LocalStorage.set('core.non_working_days', state.non_working_days)
}

export function REMOVE_NON_WORKING_DAY (state, payload) {
	console.log('REMOVE_NON_WORKING_DAY payload')
	console.log(payload)
	const workingDays = state.working_days
		.find(
			workingDay => workingDay.workspace === payload.workspace &&
										workingDay.project === payload.project
		)

	removeElement(workingDays.non_working_days, payload.id)
	removeElementById(state.non_working_days, payload)

	LocalStorage.set('core.working_days', state.working_days)
	LocalStorage.set('core.non_working_days', state.non_working_days)
}

/** ATTACHMENTS manage block **/
function saveIssueAttachmentStateToLocalStorage (state) {
	LocalStorage.set('core.issue_attachments', state.issue_attachments)
}

export function ADD_ATTACHMENT (state, payload) {
	state.issue_attachments.push(payload)
	saveIssueAttachmentStateToLocalStorage(state)
}

export function UPDATE_ATTACHMENT (state, payload) {
	const attachment = state.issue_attachments
		.find(attachmentEl => attachmentEl.id === payload)

	syncPair(payload, attachment)
	saveIssueAttachmentStateToLocalStorage(state)
}

export function DELETE_ATTACHMENT (state, payload) {
	const attachment = state.issue_attachments
		.find(attachmentEl => attachmentEl.id === payload)

	removeElement(state.issue_attachments, attachment)
	saveIssueAttachmentStateToLocalStorage(state)
}

/** BACKLOG manage block **/
export function ORDER_BACKLOG_ISSUES (state, payload) {
	const project = payload[0].project
	const backlogIndex = findBacklogByProjectId(state, project)
	state.backlogs[backlogIndex].issues = payload
	LocalStorage.set('core.backlogs', state.backlogs)
}

export function ADD_ISSUE_TO_BACKLOG (state, payload) {
	const backlog = state.backlogs
		.find(backlog => backlog.project_id === payload.project)

	backlog.issues.push(payload.id)

	LocalStorage.set('core.backlogs', state.backlogs)
}

export function UPDATE_BACKLOG_ISSUES (state, composite) {
	/** Just update core inside of Backlog
   * We use composite data for mutation **/
	const backlog = state.backlogs
		.find(backlog => backlog.id === composite.id)
	backlog.issues = composite.issues

	for (const [index, issueId] of backlog.issues.entries()) {
		const issue = state.issues.find(issue => issue.id === issueId)
		issue.ordering = index
	}

	LocalStorage.set('core.backlogs', state.backlogs)
	LocalStorage.set('core.issues', state.issues)
}

export function UPDATE_BACKLOG (state, payload) {
	const backlogIndex = findBacklogByProjectId(state, payload.id)
	state.backlogs.splice(backlogIndex, 1, payload)

	LocalStorage.set('core.backlogs', state.backlogs)
}

/** Issues Block **/
function saveIssuesStateToLocalStorage (state) {
	LocalStorage.set('core.issues', state.issues)
}

export function ADD_ISSUE_TO_ISSUES (state, payload) {
	state.issues.push(payload)
	saveIssuesStateToLocalStorage(state)
}

export function UPDATE_ISSUE (state, payload) {
	/** Update issue by full portion **/
	updateElementById(state.issues, payload)
	saveIssuesStateToLocalStorage(state)
}

export function ADD_ATTACHMENT_TO_ISSUE (state, payload) {
	const issueId = payload.issue
	const attachmentId = payload.attachment.id

	const issue = state.issues
		.find(issue => issue.id === issueId)

	issue.attachments.push(attachmentId)
	saveIssuesStateToLocalStorage(state)
}

export function REMOVE_ATTACHMENT_FROM_ISSUE (state, payload) {
	const issueId = payload.issue
	const attachmentId = payload.attachment.id

	const issue = state.issue
		.find(issue => issue.id === issueId)

	removeElement(issue.attachments, attachmentId)
	saveIssuesStateToLocalStorage(state)
}

export function UPDATE_ISSUE_STATE (state, payload) {
	/** Payload content issue object **/
	const issue = state.issues
		.find(issue => issue.id === payload.id)

	issue.state_category = payload.state_category

	saveIssuesStateToLocalStorage(state)
}

export function UPDATE_ISSUES_ORDERING (state, payload) {
	payload.forEach((issuePayload) => {
		const issue = state.issues
			.filter((issue) => issue.id === issuePayload.id).pop()
		issue.ordering = issuePayload.ordering
	})

	saveIssuesStateToLocalStorage(state)
}

export function ADD_SPRINT_TO_PROJECT (state, payload) {
	state.sprints.push(payload)

	LocalStorage.set('core.sprints', state.sprints)
}

export function UPDATE_SPRINT_ISSUES (state, composite) {
	/** Just update core inside sprint
   *  We use composite data for mutation **/
	const sprint = state.sprints
		.find(sprint => sprint.id === composite.id)

	sprint.issues = composite.issues

	for (const [index, issueId] of sprint.issues.entries()) {
		const issue = state.issues.find(issue => issue.id === issueId)
		issue.ordering = index
	}

	LocalStorage.set('core.sprints', state.sprints)
	LocalStorage.set('core.issues', state.issues)
}

export function START_SPRINT (state, sprintId) {
	/** Start sprint without checking - was it started before or no **/
	const sprint = state.sprints
		.find(sprint => sprint.id === sprintId)
	sprint.is_started = true

	LocalStorage.set('core.sprints', state.sprints)
}

export function COMPLETE_SPRINT (state, sprintId) {
	/** Compete sprint without checking - was it started
   * or completed before
   * **/
	const sprint = state.sprints
		.find(sprint => sprint.id === sprintId)
	sprint.is_completed = true

	LocalStorage.set('core.sprints', state.sprints)
}

export function DELETE_SPRINT (state, sprintId) {
	/** Remove sprint from the list of sprints **/

	const sprintIndex = findSprintIndexById(state, sprintId)
	state.sprints.splice(sprintIndex, 1)

	LocalStorage.set('core.sprints', state.sprints)
}

export function UPDATE_SPRINT (state, payload) {
	/**
   * We use this mutation for update core inside of sprint
   * We can update base sprint information also **/
	const sprintIndex = findSprintIndexById(state, payload.id)
	state.sprints.splice(sprintIndex, 1, payload)

	LocalStorage.set('core.sprints', state.sprints)
}

/** Issue Type Category management **/
export function ADD_ISSUE_TYPE_CATEGORY (state, payload) {
	state.issue_types.push(payload)

	LocalStorage.set('core.issue_types', state.issue_types)
}

export function UPDATE_ISSUE_TYPE_CATEGORY (state, payload) {
	const issueType = state.issue_types
		.find(typeCategory => typeCategory.id === payload.id)

	syncPair(payload, issueType)

	LocalStorage.set('core.issue_types', state.issue_types)
}

export function DELETE_ISSUE_TYPE_CATEGORY (state, payload) {
	const issueType = state.issue_types
		.find(typeCategory => typeCategory.id === payload.id)

	removeElement(state.issue_types, issueType)

	LocalStorage.set('core.issue_types', state.issue_types)
}

/** Issue Type Icons Category management */
export function ADD_ISSUE_TYPE_ICON_CATEGORY (state, payload) {
	state.issue_type_icons.push(payload)

	LocalStorage.set('core.issue_type_icons', state.issue_type_icons)
}

export function UPDATE_ISSUE_TYPE_ICON_CATEGORY (state, payload) {
	const issueTypeIcon = state.issue_type_icons
		.find(typeIconCategory => typeIconCategory.id === payload.id)

	syncPair(payload, issueTypeIcon)

	LocalStorage.set('core.issue_type_icons', state.issue_type_icons)
}

export function DELETE_ISSUE_TYPE_ICON_CATEGORY (state, payload) {
	removeElementById(state.issue_type_icons, payload)

	LocalStorage.set('core.issue_type_icons', state.issue_type_icons)
}

/** Issue State Category management **/
export function ADD_ISSUE_STATE_CATEGORY (state, payload) {
	state.issue_states.push(payload)

	LocalStorage.set('core.issue_states', state.issue_states)
}

export function UPDATE_ISSUE_STATE_CATEGORY (state, payload) {
	const issueState = state.issue_states
		.find(stateCategory => stateCategory.id === payload.id)

	syncPair(payload, issueState)

	LocalStorage.set('core.issue_states', state.issue_states)
}

export function DELETE_ISSUE_STATE_CATEGORY (state, payload) {
	const issueState = state.issue_states
		.find(stateCategory => stateCategory.id === payload.id)

	removeElement(state.issue_states, issueState)

	LocalStorage.set('core.issue_states', state.issue_states)
}

/** Issue Estimation Category management **/
export function ADD_ISSUE_ESTIMATION_CATEGORY (state, payload) {
	state.issue_estimations.push(payload)

	LocalStorage.set('core.issue_estimations', state.issue_estimations)
}

export function UPDATE_ISSUE_ESTIMATION_CATEGORY (state, payload) {
	const issueEstimation = state.issue_estimations
		.find(estimationCategory => estimationCategory.id === payload.id)

	syncPair(payload, issueEstimation)

	LocalStorage.set('core.issue_estimations', state.issue_estimations)
}

export function DELETE_ISSUE_ESTIMATION_CATEGORY (state, payload) {
	const issueEstimation = state.issue_estimations
		.find(estimationCategory => estimationCategory.id === payload.id)

	removeElement(state.issue_estimations, issueEstimation)

	LocalStorage.set('core.issue_estimations', state.issue_estimations)
}

export function UPDATE_ISSUE_TYPES (state, payload) {
	state.issue_types = payload

	LocalStorage.set('core.issue_types', payload)
}

export function UPDATE_ISSUE_TYPE_ICONS (state, payload) {
	state.issue_type_icons = payload

	LocalStorage.set('core.issue_type_icons', payload)
}

export function UPDATE_ISSUE_STATES (state, payload) {
	state.issue_states = payload

	LocalStorage.set('core.issue_states', payload)
}

export function UPDATE_ISSUE_ESTIMATIONS (state, payload) {
	state.issue_estimations = payload

	LocalStorage.set('core.issue_estimations', payload)
}

export function DELETE_ISSUE (state, payload) {
	removeElementById(state.issues, payload)
	LocalStorage.set('core.issues', state.issues)
}

export function RESET (state) {
	const localStorageResetList = [
		'backlogs',
		'sprints',
		'issues',
		'issue_types',
		'issue_type_icons',
		'issue_states',
		'issue_attachments',
		'issue_estimations',
		'sprint_durations',
		'working_days',
		'non_working_days'
	]

	for (const element of localStorageResetList) {
		LocalStorage.remove(`core.${element}`)
	}

	Object.assign(state, empty())
}
