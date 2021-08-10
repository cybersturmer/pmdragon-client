import { ErrorHandler, unWatch } from 'src/services/util'
import { PresetsActionsMixin } from 'src/services/actions/presets'

export const CoreActionsMixin = {
	mixins: [
		PresetsActionsMixin
	],
	methods: {
		async getBacklogs () {
			return this.__getEntities(
				'core',
				'backlogs',
				'core/UPDATE_BACKLOGS'
			)
		},
		async getSprints () {
			return this.__getEntities(
				'core',
				'sprints',
				'core/UPDATE_SPRINTS'
			)
		},
		async getIssues () {
			return this.__getEntities(
				'core',
				'issues',
				'core/UPDATE_ISSUES'
			)
		},
		async getSprintDurations () {
			return this.__getEntities(
				'core',
				'sprint-durations',
				'core/UPDATE_SPRINT_DURATIONS'
			)
		},
		async getIssueStates () {
			return this.__getEntities(
				'core',
				'issue-states',
				'core/UPDATE_ISSUE_STATES'
			)
		},
		async getIssueTypes () {
			return this.__getEntities(
				'core',
				'issue-types',
				'core/UPDATE_ISSUE_TYPES'
			)
		},
		async getAttachments () {
			return this.__getEntities(
				'core',
				'issue-attachments',
				'core/UPDATE_ATTACHMENTS'
			)
		},
		async getIssueTypeIcons () {
			return this.__getEntities(
				'core',
				'issue-type-icons',
				'core/UPDATE_ISSUE_TYPE_ICONS'
			)
		},
		async getIssueEstimations () {
			return this.__getEntities(
				'core',
				'issue-estimations',
				'core/UPDATE_ISSUE_ESTIMATIONS'
			)
		},
		async addAttachment (payload) {
			const formData = new FormData()

			formData.append('file', payload.file)
			formData.append('data', JSON.stringify(payload.data))

			try {
				const response =
					await this.$http
						.auth(true)
						.expect(201)
						.post(
							'/core/issue-attachments/',
							formData,
							{
								headers: {
									'Content-Type': 'multipart/form-data'
								}
							}
						)

				this.$store.commit('core/ADD_ATTACHMENT', response.data)

				const issuePayload = {
					issue: payload.data.issue,
					attachment: response.data
				}

				this.$store.commit('core/ADD_ATTACHMENT_TO_ISSUE', issuePayload)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async addAttachments (files) {
			const payloadTemplate = {
				workspace: this.$store.getters['auth/WORKSPACE_ID'],
				project: this.$store.getters['current/PROJECT'],
				title: '',
				issue: this.issue.id
			}

			for (const file of files) {
				payloadTemplate.title = file.name

				const payload = {
					file: file,
					data: payloadTemplate
				}

				try {
					await this.addAttachment(payload)
				} catch (e) {
					return Promise.reject('One of files was not uploaded')
				}
			}

			return Promise.resolve('Successfully uploaded')
		},
		async patchAttachment (payload) {
			return this.__patchEntity(
				`/core/issue-attachments/${payload.id}/`,
				payload,
				'core/UPDATE_ATTACHMENT'
			)
		},
		async deleteAttachment (payload) {
			try {
				const response =
					await this.$http
						.auth(true)
						.expect(204)
						.delete(
							`/core/issue-attachments/${payload.attachment.id}/`
						)

				this.$store.commit('core/DELETE_ATTACHMENT', payload.attachment)
				this.$store.commit('core/REMOVE_ATTACHMENT_FROM_ISSUE', payload)

				return Promise.resolve(response)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async addIssueTypeCategory (payload) {
			try {
				const response =
					await this.$http
						.auth(true)
						.expect(201)
						.post(
							'/core/issue-types/',
							payload
						)

				this.$store.commit('core/ADD_ISSUE_TYPE_CATEGORY', response.data)
				return Promise.resolve(response)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async updateIssueTypeCategory (payload) {
			const watchedDefault = this.$store.getters['core/ISSUE_TYPE_BY_DEFAULT']
			/** If payload is unset default status and there is no more default
			 * We have to reject it and throw an exception **/

			if (payload.is_default === false && (watchedDefault === undefined || watchedDefault.id === payload.id)) {
				throw new ErrorHandler(new Error(), 'You cannot disable the only one default')
			}

			try {
				const response =
					await this.$http
						.auth(true)
						.expect(200)
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

						this.$store.commit('core/UPDATE_ISSUE_TYPE_CATEGORY', currentDefault)
					}
				}

				this.$store.commit('core/UPDATE_ISSUE_TYPE_CATEGORY', response.data)
				return Promise.resolve(response)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async deleteIssueTypeCategory (payload) {
			if (this.$store.getters['core/IS_TYPE_CATEGORY_BY_DEFAULT'] &&
				this.$store.getters['core/ISSUE_TYPE_BY_DEFAULT'] === payload.id) {
				throw new ErrorHandler(new Error(), 'You cannot remove default issue type')
			}

			try {
				const response =
					await this.$http
						.auth(true)
						.expect(204)
						.delete(
							`/core/issue-types/${payload.id}/`
						)

				this.$store.commit('core/DELETE_ISSUE_TYPE_CATEGORY', payload)
				return Promise.resolve(response)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async addIssueTypeIconCategory (payload) {
			try {
				const response =
					await this.$http
						.auth(true)
						.expect(201)
						.post(
							'/core/issue-type-icons/',
							payload
						)

				this.$store.commit('core/ADD_ISSUE_TYPE_ICON_CATEGORY', response.data)
				return Promise.resolve(response)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async updateIssueTypeIconCategory (payload) {
			return this.__patchEntity(
				`/core/issue-type-icons/${payload.id}/`,
				payload,
				'core/UPDATE_ISSUE_TYPE_ICON_CATEGORY'
			)
		},
		async deleteIssueTypeIconCategory (payload) {
			try {
				const response =
					await this.$http
						.auth(true)
						.expect(204)
						.delete(
							`/core/issue-type-icons/${payload.id}/`
						)

				this.$store.commit('core/DELETE_ISSUE_TYPE_ICON_CATEGORY', payload)
				return Promise.resolve(response)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async addIssueStateCategory (payload) {
			try {
				const response =
					await this.$http
						.auth(true)
						.expect(201)
						.post(
							'/core/issue-states/',
							payload
						)

				this.$store.commit('core/ADD_ISSUE_STATE_CATEGORY', response.data)
				return Promise.resolve(response)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async updateIssueStateCategory (payload) {
			const watchedDefault = this.$store.getters['core/ISSUE_STATE_BY_DEFAULT']
			/** If payload is unset default state and there are no more default
			 * We have to reject it and throw an exceptions **/

			if (payload.is_default === false && (watchedDefault === undefined || watchedDefault.id === payload.id)) {
				throw new ErrorHandler(new Error(), 'You cannot disable the only one default')
			}

			try {
				const response =
					await this.$http
						.auth(true)
						.expect(200)
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

						this.$store.commit('core/UPDATE_ISSUE_STATE_CATEGORY', currentDefault)
					}
				}

				this.$store.commit('core/UPDATE_ISSUE_STATE_CATEGORY', response.data)
				return Promise.resolve(response)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async deleteIssueStateCategory (payload) {
			if (this.$store.getters['core/IS_STATE_CATEGORY_BY_DEFAULT'] &&
				this.$store.getters['core/ISSUE_STATE_BY_DEFAULT'].id === payload.id) {
				throw new ErrorHandler(new Error(), 'You cannot remove default issue state')
			}

			try {
				const response =
					await this.$http
						.auth(true)
						.expect(204)
						.delete(
							`/core/issue-states/${payload.id}/`
						)

				this.$store.commit('core/DELETE_ISSUE_STATE_CATEGORY', payload)
				return Promise.resolve(response)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async addIssueEstimationCategory (payload) {
			try {
				const response =
					await this.$http
						.auth(true)
						.expect(201)
						.post(
							'/core/issue-estimations/',
							payload
						)

				this.$store.commit('core/ADD_ISSUE_ESTIMATION_CATEGORY', response.data)
				return Promise.resolve(response)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async updateIssueEstimationCategory (payload) {
			return this.__patchEntity(
				`/core/issue-estimations/${payload.id}/`,
				payload,
				'core/UPDATE_ISSUE_ESTIMATION_CATEGORY'
			)
		},
		async deleteIssueEstimationCategory (payload) {
			try {
				const response =
					await this.$http
						.auth(true)
						.expect(204)
						.delete(
							`/core/issue-estimations/${payload.id}/`
						)

				this.$store.commit('core/DELETE_ISSUE_ESTIMATION_CATEGORY', payload)
				return Promise.resolve(response)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async patchIssue (payload) {
			/** At least id and one more param must be provided
			 * For example: {
			 *   id: 1,
			 *   issue_state: 2
			 * }
			 * **/
			return this.__patchEntity(
				`/core/issues/${payload.id}/`,
				payload,
				'core/UPDATE_ISSUE'
			)
		},
		async updateIssueState (payload) {
			try {
				const response =
					await this.$http
						.auth(true)
						.expect(200)
						.patch(
							`/core/issues/${payload.id}/`,
							{ state_category: payload.state_category }
						)

				this.$store.commit('core/UPDATE_ISSUE_STATE', payload)
				return Promise.resolve(response)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async updateIssuesInSprint (composite) {
			const sendPayload = {
				issues: composite.issues
			}

			try {
				const response =
					await this.$http
						.auth(true)
						.expect(200)
						.patch(
							`/core/sprints/${composite.id}/`,
							sendPayload
						)

				this.$store.commit('core/UPDATE_SPRINT_ISSUES', composite)
				return Promise.resolve(response)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async updateIssuesInBacklog (composite) {
			const sendPayload = {
				issues: composite.issues
			}

			try {
				const response =
					await this.$http
						.auth(true)
						.expect(200)
						.patch(
							`/core/backlogs/${composite.id}/`,
							sendPayload
						)

				this.$store.commit('core/UPDATE_BACKLOG_ISSUES', composite)
				return Promise.resolve(response)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async addIssueToBacklog (payload) {
			try {
				const response =
					await this.$http
						.auth(true)
						.expect(201)
						.post(
							'/core/issues/',
							payload
						)

				this.$store.commit('core/ADD_ISSUE_TO_BACKLOG', response.data)
				this.$store.commit('core/ADD_ISSUE_TO_ISSUES', response.data)

				return Promise.resolve(response)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async addSprintToProject (payload) {
			try {
				const response =
					await this.$http
						.auth(true)
						.expect(201)
						.post(
							'/core/sprints/',
							payload
						)

				this.$store.commit('core/ADD_SPRINT_TO_PROJECT', response.data)
				return Promise.resolve(response)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async startSprint (sprintId) {
			try {
				const response =
					await this.$http
						.auth(true)
						.expect(200)
						.patch(
							`/core/sprints/${sprintId}/`,
							{ is_started: true }
						)

				this.$store.commit('core/START_SPRINT', sprintId)
				return Promise.resolve(response)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async completeSprint (sprintId) {
			try {
				const response =
					await this.$http
						.auth(true)
						.expect(200)
						.patch(
							`/core/sprints/${sprintId}/`,
							{ is_competed: true }
						)

				this.$store.commit('core/COMPLETE_SPRINT', sprintId)
				return Promise.resolve(response)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async editSprint (payload) {
			const sendPayload = {
				title: payload.title,
				goal: payload.goal,
				started_at: payload.startedAt,
				finished_at: payload.finishedAt
			}

			try {
				const response =
					await this.$http
						.auth(true)
						.expect(200)
						.patch(
							`/core/sprints/${payload.id}/`,
							sendPayload
						)

				this.$store.commit('core/UPDATE_SPRINT', response.data)
				return Promise.resolve(response)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async deleteSprint (sprintId) {
			try {
				const response =
					await this.$http
						.auth(true)
						.expect(204)
						.delete(
							`/core/sprints/${sprintId}/`
						)

				this.$store.commit('core/DELETE_SPRINT', sprintId)
				return Promise.resolve(response)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async deleteIssue (payload) {
			try {
				const response =
					await this.$http
						.auth(true)
						.expect(204)
						.delete(
							`/core/issues/${payload.id}/`
						)

				this.$store.commit('core/DELETE_ISSUE', payload)
				return Promise.resolve(response)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async orderBacklogIssues (payload) {
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
				const response =
					await this.$http
						.auth(true)
						.expect(200)
						.put(
							'/core/issue/ordering/',
							issuesPayload
						)

				this.$store.commit('core/ORDER_BACKLOG_ISSUES', payload)
				return Promise.resolve(response)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async updateIssuesOrdering (payload) {
			try {
				const response =
					await this.$http
						.auth(true)
						.expect(200)
						.put(
							'/core/issue/ordering/',
							payload
						)

				this.$store.commit('core/UPDATE_ISSUES_ORDERING', payload)
				return Promise.resolve(response)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		}
	}
}
