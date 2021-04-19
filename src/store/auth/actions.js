import { Api } from 'src/services/api'
import { ErrorHandler } from 'src/services/util'

export async function REGISTER ({ commit }, credentials) {
	try {
		await new Api({
			expectedStatus: 201
		})
			.post(
				'/auth/person-registration-requests/',
				credentials
			)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function LOGIN ({ commit }, credentials) {
	try {
		const response = await new Api({ expectedStatus: 200 })
			.post(
				'/auth/obtain/',
				credentials
			)

		commit('SET_ACCESS_TOKEN', response.data.access)
		commit('SET_REFRESH_TOKEN', response.data.refresh)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function FORGOT_PASSWORD ({ commit }, payload) {
	try {
		await new Api({ expectedStatus: 201 })
			.post('/auth/person-password-forgot-requests/', payload)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function REFRESH ({ commit, getters }) {
	const payload = {
		refresh: getters.REFRESH_TOKEN
	}

	try {
		const response = await new Api({ expectedStatus: 200 })
			.post(
				'/auth/refresh/',
				payload
			)

		commit('SET_ACCESS_TOKEN', response.data.access)
		commit('SET_REFRESH_TOKEN', response.data.refresh)

		return Promise.resolve(response.data)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function INIT_WORKSPACES ({ commit }) {
	try {
		const response = await new Api({
			auth: true,
			expectedStatus: 200
		})
			.get('/core/workspaces/')
		commit('INIT_WORKSPACES', response.data)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function INIT_PERSONS ({ commit }) {
	/**
  * Collaborator is everyone who is in the same workspaces as you are
  * So by init we get all persons/participant in workspace we belong to **/

	try {
		const response = await new Api({
			auth: true,
			expectedStatus: 200
		})
			.get('core/persons/')
		commit('INIT_PERSONS', response.data)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function INIT_INVITED ({ commit }) {
	/** Get only valid invited persons for all workspaces **/

	try {
		const response = await new Api({
			auth: true,
			expectedStatus: 200
		})
			.get('auth/person-invitation-requests/')
		commit('INIT_INVITED', response.data)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function ADD_WORKSPACE ({ commit }, payload) {
	try {
		const response = await new Api({
			auth: true,
			expectedStatus: 201
		})
			.post(
				'/core/workspaces/',
				payload
			)

		commit('ADD_WORKSPACE', response.data)

		return response.data
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function ADD_PROJECT ({ commit }, payload) {
	try {
		const response = await new Api({
			auth: true,
			expectedStatus: 201
		})
			.post(
				'/core/projects/',
				payload
			)

		commit('ADD_PROJECT', response.data)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function UPDATE_PROJECT ({ commit }, payload) {
	try {
		const response = await new Api({
			auth: true,
			expectedStatus: 200
		})
			.patch(
				`/core/projects/${payload.id}/`,
				payload
			)

		commit('UPDATE_PROJECT', response.data)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function DELETE_PROJECT ({ commit }, payload) {
	try {
		await new Api({
			auth: true,
			expectedStatus: 204
		})
			.delete(
				`/core/projects/${payload.id}/`
			)

		commit('DELETE_PROJECT', payload)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function INVITE_TEAM ({ commit }, payload) {
	/**
   * Not related to Vuex store now, however gonna let it stay here **/
	try {
		const response = await new Api({
			auth: true,
			expectedStatus: 201
		})
			.post(
				'/core/person-invitation-requests/',
				payload
			)

		for (const datum of response.data) {
			commit('ADD_INVITED', datum)
		}
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function REMOVE_TEAM_MEMBER ({ commit, getters }, personId) {
	const currentWorkspace = getters.WORKSPACE_DATA
	const currentParticipantsDetailed = currentWorkspace.participants

	const updatedParticipantsIds = []
	for (const participant of currentParticipantsDetailed) {
		if (participant.id !== personId) {
			updatedParticipantsIds.push(participant.id)
		}
	}

	const updatedPayload = {
		participants: updatedParticipantsIds
	}

	try {
		await new Api({
			auth: true,
			expectedStatus: 200
		})
			.patch(
				`/core/workspaces/${currentWorkspace.id}/`,
				updatedPayload
			)

		commit('REMOVE_PARTICIPANT', {
			workspaceId: currentWorkspace.id,
			participantId: personId
		})
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function UPDATE_MY_DATA ({ commit }, payload) {
	try {
		const response = await new Api({
			auth: true,
			expectedStatus: 200
		})
			.put('/auth/me/', payload)

		commit('SET_MY_FIRST_NAME', response.data.first_name)
		commit('SET_MY_LAST_NAME', response.data.last_name)
		commit('SET_MY_USERNAME', response.data.username)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function UPDATE_MY_PASSWORD ({ commit }, payload) {
	try {
		await new Api({
			auth: true,
			expectedStatus: 200
		})
			.post('/auth/password/change/', payload)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function UPDATE_MY_AVATAR ({ commit }, file) {
	const formData = new FormData()
	formData.append('image', file)

	try {
		const response = await new Api({
			auth: true,
			expectedStatus: 200
		})
			.put('/auth/avatar/', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})

		commit('SET_MY_AVATAR', response.data.avatar)

		return response.data
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export async function DELETE_MY_AVATAR ({ commit }) {
	try {
		await new Api({
			auth: true,
			expectedStatus: 204
		})
			.delete('/auth/avatar/')

		commit('RESET_MY_AVATAR')
	} catch (e) {
		throw new ErrorHandler(e)
	}
}

export function RESET ({ commit }) {
	commit('RESET')
}
