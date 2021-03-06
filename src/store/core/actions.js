import { ErrorHandler, unWatch } from 'src/services/util'
import { Api } from 'src/services/api'

export async function INIT_BACKLOGS ({ commit }) {
	try {
		const response = await new Api({
			auth: true,
			expectedStatus: 200
		})
			.get(
				'/core/backlogs/'
			)

		commit('INIT_BACKLOGS', response.data)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function INIT_SPRINTS ({ commit }) {
	try {
		const response = await new Api({
			auth: true,
			expectedStatus: 200
		})
			.get(
				'/core/sprints/'
			)

		commit('INIT_SPRINTS', response.data)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function INIT_ISSUES ({ commit }) {
	try {
		const response = await new Api({
			auth: true,
			expectedStatus: 200
		})
			.get(
				'/core/issues/'
			)

		commit('INIT_ISSUES', response.data)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function INIT_SPRINT_DURATIONS ({ commit }) {
	try {
		const response = await new Api({
			auth: true,
			expectedStatus: 200
		})
			.get(
				'/core/sprint-durations/'
			)

		commit('INIT_SPRINT_DURATIONS', response.data)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function INIT_ISSUE_STATES ({ commit }) {
	try {
		const response = await new Api({
			auth: true,
			expectedStatus: 200
		})
			.get(
				'/core/issue-states/'
			)

		commit('UPDATE_ISSUE_STATES', response.data)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function INIT_ISSUE_TYPES ({ commit }) {
	try {
		const response = await new Api({
			auth: true,
			expectedStatus: 200
		})
			.get(
				'/core/issue-types/'
			)

		commit('UPDATE_ISSUE_TYPES', response.data)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

/** ATTACHMENTS block **/
export async function INIT_ATTACHMENTS ({ commit }) {
	try {
		const response = await new Api({
			auth: true,
			expectedStatus: 200
		})
			.get(
				'/core/issue-attachments/'
			)

		commit('INIT_ATTACHMENTS', response.data)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function INIT_ISSUE_TYPE_ICONS ({ commit }) {
	try {
		const response = await new Api({
			auth: true,
			expectedStatus: 200
		})
			.get(
				'/core/issue-type-icons/'
			)

		commit('UPDATE_ISSUE_TYPE_ICONS', response.data)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function INIT_ISSUE_ESTIMATIONS ({ commit }) {
	try {
		const response = await new Api({
			auth: true,
			expectedStatus: 200
		})
			.get(
				'/core/issue-estimations/'
			)

		commit('UPDATE_ISSUE_ESTIMATIONS', response.data)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function ADD_ATTACHMENT ({ commit }, payload) {
	const formData = new FormData()
	formData.append('file', payload.file)
	formData.append('data', JSON.stringify(payload.data))

	try {
		const response = await new Api({
			auth: true,
			expectedStatus: 201
		})
			.post(
				'/core/issue-attachments/',
				formData, {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				}
			)

		commit('ADD_ATTACHMENT', response.data)

		const issuePayload = {
			issue: payload.data.issue,
			attachment: response.data
		}

		commit('ADD_ATTACHMENT_TO_ISSUE', issuePayload)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function PATCH_ATTACHMENT ({ commit }, payload) {
	try {
		const response = await new Api({
			auth: true,
			expectedStatus: 200
		})
			.patch(
				`/core/issue-attachments/${payload.id}/`,
				payload
			)

		commit('UPDATE_ATTACHMENT', response.data)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function DELETE_ATTACHMENT ({ commit }, payload) {
	try {
		await new Api({
			auth: true,
			expectedStatus: 204
		})
			.delete(
				`/core/issue-attachments/${payload.attachment.id}/`
			)

		commit('DELETE_ATTACHMENT', payload.attachment)
		commit('REMOVE_ATTACHMENT_FROM_ISSUE', payload)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

/** Issue types actions **/
export async function ADD_ISSUE_TYPE_CATEGORY ({ commit }, payload) {
	try {
		const response = await new Api({
			auth: true,
			expectedStatus: 201
		})
			.post(
				'/core/issue-types/',
				payload
			)

		commit('ADD_ISSUE_TYPE_CATEGORY', response.data)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function UPDATE_ISSUE_TYPE_CATEGORY ({ commit, getters }, payload) {
	const watchedDefault = getters.ISSUE_TYPE_BY_DEFAULT
	/** If payload is unset default status and there is no more default
   * We have to reject it and throw an exception **/

	if (payload.is_default === false && (watchedDefault === undefined || watchedDefault.id === payload.id)) {
		throw new ErrorHandler(new Error(), 'You cannot disable the only one default')
	}

	try {
		const response = await new Api({
			auth: true,
			expectedStatus: 200
		})
			.patch(
				`/core/issue-types/${payload.id}/`,
				payload
			)

		/** If this type category is set to default and there is one more type category set by default
     * we have to unset for it is_default to false and save it to state. **/
		if (response.data.is_default === true && (!!watchedDefault || watchedDefault.id !== response.data.id)) {
			const currentDefault = unWatch(watchedDefault)

			if (payload.id !== currentDefault.id) {
				currentDefault.is_default = false

				commit('UPDATE_ISSUE_TYPE_CATEGORY', currentDefault)
			}
		}

		commit('UPDATE_ISSUE_TYPE_CATEGORY', response.data)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function DELETE_ISSUE_TYPE_CATEGORY ({ commit, getters }, payload) {
	if (getters.IS_TYPE_CATEGORY_BY_DEFAULT && getters.ISSUE_TYPE_BY_DEFAULT.id === payload.id) {
		throw new ErrorHandler(new Error(), 'You cannot remove default issue type')
	}

	try {
		await new Api({
			auth: true,
			expectedStatus: 204
		})
			.delete(
				`/core/issue-types/${payload.id}/`
			)

		commit('DELETE_ISSUE_TYPE_CATEGORY', payload)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

/** Issue types' icons */
export async function ADD_ISSUE_TYPE_ICON_CATEGORY ({ commit }, payload) {
	try {
		const response = await new Api({
			auth: true,
			expectedStatus: 201
		})
			.post(
				'/core/issue-type-icons/',
				payload
			)

		commit('ADD_ISSUE_TYPE_ICON_CATEGORY', response.data)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function UPDATE_ISSUE_TYPE_ICON_CATEGORY ({ commit }, payload) {
	try {
		const response = await new Api({
			auth: true,
			expectedStatus: 200
		})
			.patch(
				`/core/issue-type-icons/${payload.id}/`,
				payload
			)

		commit('UPDATE_ISSUE_TYPE_ICON_CATEGORY', response.data)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function DELETE_ISSUE_TYPE_ICON_CATEGORY ({ commit }, payload) {
	try {
		await new Api({
			auth: true,
			expectedStatus: 204
		})
			.delete(
				`/core/issue-type-icons/${payload.id}/`
			)

		commit('DELETE_ISSUE_TYPE_ICON_CATEGORY', payload)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

/** Issue states actions **/
export async function ADD_ISSUE_STATE_CATEGORY ({ commit }, payload) {
	try {
		const response = await new Api({
			auth: true,
			expectedStatus: 201
		})
			.post(
				'/core/issue-states/',
				payload
			)

		commit('ADD_ISSUE_STATE_CATEGORY', response.data)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function UPDATE_ISSUE_STATE_CATEGORY ({ commit, getters }, payload) {
	const watchedDefault = getters.ISSUE_STATE_BY_DEFAULT
	/** If payload is unset default state and there are no more default
   * We have to reject it and throw an exceptions **/

	if (payload.is_default === false && (watchedDefault === undefined || watchedDefault.id === payload.id)) {
		throw new ErrorHandler(new Error(), 'You cannot disable the only one default')
	}

	try {
		const response = await new Api({
			auth: true,
			expectedStatus: 200
		})
			.patch(
				`/core/issue-states/${payload.id}/`,
				payload
			)

		/** If this type category is set to default and there is one more type category set by default
     * we have to unset for it is_default to false and save it to state. **/
		if (response.data.is_default === true && (!!watchedDefault || watchedDefault.id !== response.data.id)) {
			const currentDefault = unWatch(watchedDefault)

			if (payload.id !== currentDefault.id) {
				currentDefault.is_default = false

				commit('UPDATE_ISSUE_STATE_CATEGORY', currentDefault)
			}
		}

		commit('UPDATE_ISSUE_STATE_CATEGORY', response.data)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function DELETE_ISSUE_STATE_CATEGORY ({ commit, getters }, payload) {
	if (getters.IS_STATE_CATEGORY_BY_DEFAULT && getters.ISSUE_STATE_BY_DEFAULT.id === payload.id) {
		throw new ErrorHandler(new Error(), 'You cannot remove default issue state')
	}

	try {
		await new Api({
			auth: true,
			expectedStatus: 204
		})
			.delete(
				`/core/issue-states/${payload.id}/`
			)

		commit('DELETE_ISSUE_STATE_CATEGORY', payload)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

/** Issue estimations actions **/
export async function ADD_ISSUE_ESTIMATION_CATEGORY ({ commit }, payload) {
	try {
		const response = await new Api({
			auth: true,
			expectedStatus: 201
		})
			.post(
				'/core/issue-estimations/',
				payload
			)

		commit('ADD_ISSUE_ESTIMATION_CATEGORY', response.data)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function UPDATE_ISSUE_ESTIMATION_CATEGORY ({ commit }, payload) {
	try {
		const response = await new Api({
			auth: true,
			expectedStatus: 200
		})
			.patch(
				`/core/issue-estimations/${payload.id}/`,
				payload
			)

		commit('UPDATE_ISSUE_ESTIMATION_CATEGORY', response.data)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function DELETE_ISSUE_ESTIMATION_CATEGORY ({ commit }, payload) {
	try {
		await new Api({
			auth: true,
			expectedStatus: 204
		})
			.delete(
				`/core/issue-estimations/${payload.id}/`
			)

		commit('DELETE_ISSUE_ESTIMATION_CATEGORY', payload)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function PATCH_ISSUE ({ commit }, payload) {
	/** At least id and one more param must be provided
   * For example: {
   *   id: 1,
   *   issue_state: 2
   * }
   * **/

	try {
		const response = await new Api({
			auth: true,
			expectedStatus: 200
		})
			.patch(
				`/core/issues/${payload.id}/`,
				payload
			)

		commit('UPDATE_ISSUE', response.data)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function UPDATE_ISSUE_STATE ({ commit }, payload) {
	try {
		await new Api({
			auth: true,
			expectedStatus: 200
		})
			.patch(
				`/core/issues/${payload.id}/`,
				{ state_category: payload.state_category }
			)

		commit('UPDATE_ISSUE_STATE', payload)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function UPDATE_ISSUES_IN_SPRINT ({ commit }, composite) {
	const sendPayload = {
		issues: composite.issues
	}

	try {
		await new Api({
			auth: true,
			expectedStatus: 200
		})
			.patch(
				`/core/sprints/${composite.id}/`,
				sendPayload
			)

		commit('UPDATE_SPRINT_ISSUES', composite)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function UPDATE_ISSUES_IN_BACKLOG ({ commit }, composite) {
	const sendPayload = {
		issues: composite.issues
	}

	try {
		await new Api({
			auth: true,
			expectedStatus: 200
		})
			.patch(
				`/core/backlogs/${composite.id}/`,
				sendPayload
			)

		commit('UPDATE_BACKLOG_ISSUES', composite)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function ADD_ISSUE_TO_BACKLOG ({ commit }, payload) {
	try {
		const response = await new Api({
			auth: true,
			expectedStatus: 201
		})
			.post(
				'/core/issues/',
				payload
			)

		commit('ADD_ISSUE_TO_BACKLOG', response.data)
		commit('ADD_ISSUE_TO_ISSUES', response.data)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function ADD_SPRINT_TO_PROJECT ({ commit }, payload) {
	try {
		const response = await new Api({
			auth: true,
			expectedStatus: 201
		})
			.post(
				'/core/sprints/',
				payload
			)

		commit('ADD_SPRINT_TO_PROJECT', response.data)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function START_SPRINT ({ commit }, sprintId) {
	try {
		await new Api({
			auth: true,
			expectedStatus: 200
		})
			.patch(
				`/core/sprints/${sprintId}/`,
				{ is_started: true }
			)

		commit('START_SPRINT', sprintId)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function COMPLETE_SPRINT ({ commit }, sprintId) {
	try {
		await new Api({ auth: true }).patch(
			`/core/sprints/${sprintId}/`,
			{ is_completed: true }
		)

		commit('COMPLETE_SPRINT', sprintId)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function EDIT_SPRINT ({ commit }, payload) {
	const sendPayload = {
		title: payload.title,
		goal: payload.goal,
		started_at: payload.startedAt,
		finished_at: payload.finishedAt
	}

	try {
		const response = await new Api({
			auth: true,
			expectedStatus: 200
		})
			.patch(
				`/core/sprints/${payload.id}/`,
				sendPayload
			)

		commit('UPDATE_SPRINT', response.data)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function DELETE_SPRINT ({ commit }, sprintId) {
	try {
		await new Api({
			auth: true,
			expectedStatus: 204
		})
			.delete(
				`/core/sprints/${sprintId}/`
			)

		commit('DELETE_SPRINT', sprintId)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function DELETE_ISSUE ({ commit }, payload) {
	try {
		await new Api({
			auth: true,
			expectedStatus: 204
		})
			.delete(
				`/core/issues/${payload.id}/`
			)

		commit('DELETE_ISSUE', payload)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function ORDER_BACKLOG_ISSUES ({ commit, rootGetters }, payload) {
	const issuesPayload = []

	try {
		payload.forEach((value) => {
			issuesPayload.push({
				id: value.id,
				ordering: value.ordering
			})
		})
	} catch (e) {
		console.log(e)
	}

	try {
		await new Api({
			auth: true,
			expectedStatus: 200
		})
			.put(
				'/core/issue/ordering/',
				issuesPayload
			)

		commit('ORDER_BACKLOG_ISSUES', payload)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function UPDATE_ISSUES_ORDERING ({ commit }, payload) {
	try {
		await new Api({
			auth: true,
			expectedStatus: 200
		})
			.put(
				'/core/issue/ordering/',
				payload
			)

		commit('UPDATE_ISSUES_ORDERING', payload)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export function RESET ({ commit }) {
	commit('RESET')
}
