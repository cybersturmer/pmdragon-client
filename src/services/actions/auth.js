import { PresetsActionsMixin } from 'src/services/actions/presets'
import { ErrorHandler } from 'src/services/util'

export const AuthActionsMixin = {
	mixins: [
		PresetsActionsMixin
	],
	methods: {
		async addPersonRegistrationRequest (payload) {
			return this.__addEntityWithoutMutation(
				'/auth/person-registration-requests/',
				payload
			)
		},
		async obtainTokens (payload) {
			return this.$http.obtainTokens(payload)
		},
		async refreshTokens () {
			return this.$http.refreshTokens()
		},
		async addPersonPasswordForgotRequest (payload) {
			return this.__addEntityWithoutMutation(
				'/auth/person-password-forgot-requests/',
				payload
			)
		},
		async addWorkspace (payload) {
			return this.__addEntity(
				'/core/workspaces/',
				payload,
				'auth/ADD_WORKSPACE'
			)
		},
		async addProject (payload) {
			return this.__addEntity(
				'/core/projects/',
				payload,
				'auth/ADD_PROJECT'
			)
		},
		async updateProject (payload) {
			return this.__patchEntity(
				`/core/projects/${payload.id}/`,
				payload,
				'auth/UPDATE_PROJECT'
			)
		},
		async deleteProject (payload) {
			return this.__deleteEntity(
				`/core/projects/${payload.id}/`,
				payload,
				'auth/DELETE_PROJECT'
			)
		},
		async inviteTeam (payload) {
			try {
				const response =
					await this.$http
						.auth(true)
						.expect(201)
						.post(
							'/core/person-invitation-requests/',
							payload
						)

				for (const datum of response.data) {
					this.$store.commit('auth/ADD_INVITED', datum)
				}

				return Promise.resolve(response)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async removeTeamMember (personId) {
			const currentWorkspace = this.$store.getters['auth/WORKSPACE_DATA']
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
				const response =
					await this.$http
						.auth(true)
						.expect(200)
						.patch(
							`/core/workspaces/${currentWorkspace.id}/`,
							updatedPayload
						)

				this.$store.commit('auth/REMOVE_PARTICIPANT', {
					workspaceId: currentWorkspace.id,
					participantId: personId
				})

				return Promise.resolve(response)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async updateMyPerson (payload) {
			try {
				const response =
					await this.$http
						.auth(true)
						.expect(200)
						.put(
							'/auth/me/',
							payload
						)

				this.$store.commit('auth/SET_MY_FIRST_NAME', response.data.first_name)
				this.$store.commit('auth/SET_MY_LAST_NAME', response.data.last_name)
				this.$store.commit('auth/SET_MY_USERNAME', response.data.username)
				return Promise.resolve(response)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async updateMyPassword (payload) {
			try {
				const response =
					await this.$http
						.auth(true)
						.expect(200)
						.post(
							'/auth/password/change/',
							payload
						)

				return Promise.resolve(response)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async updateMyAvatar (file) {
			const formData = new FormData()
			formData.append('image', file)

			try {
				const response =
					await this.$http
						.auth(true)
						.expect(200)
						.put(
							'/auth/avatar/',
							formData, {
								'Content-Type': 'multipart/form-data'
							}
						)

				this.$store.commit('auth/SET_MY_AVATAR', response.data.avatar)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async deleteMyAvatar () {
			return this.__deleteEntity(
				'/auth/avatar/',
				'auth/RESET_MY_AVATAR'
			)
		},
		async getWorkspaces () {
			return this.__getEntities(
				'core',
				'workspaces',
				'auth/UPDATE_WORKSPACES'
			)
		},
		async getPersons () {
			return this.__getEntities(
				'core',
				'persons',
				'auth/UPDATE_PERSONS'
			)
		},
		async getInvited () {
			return this.__getEntities(
				'auth',
				'person-invitation-requests',
				'auth/UPDATE_INVITED'
			)
		}
	}
}
