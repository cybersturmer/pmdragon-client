import { PresetsActionsMixin } from 'src/services/actions/presets'
import { ErrorHandler } from 'src/services/util'

export const CurrentActionsMixin = {
	mixins: [
		PresetsActionsMixin
	],
	methods: {
		async getMessagesPacked (payload) {
			/** get messages for current issue without paging
			 * Now its not a problem, will think later **/
			return this.__getEntities(
				`/core/issue-messages-packed/${payload.id}/`,
				'current/SET_ISSUE_MESSAGES'
			)
		},
		async getMessages (payload) {
			/** get messages for current issue without paging
			 * Now its not a problem, will think later **/
			return this.__getEntities(
				`/core/issue-messages/?issue=${payload.id}`,
				'current/SET_ISSUE_MESSAGES'
			)
		},
		async getHistory (payload) {
			return this.__getEntities(
				`/core/issues-history/?issue=${payload.id}`,
				'current/SET_ISSUE_HISTORY'
			)
		},
		async addMessage (payload) {
			return this.__addEntityWithoutMutation(
				'/core/issue-messages/',
				payload
			)
		},
		async updateMessage (payload) {
			return this.__patchEntityWithoutMutation(
				`/core/issue-messages/${payload.id}/`,
				payload
			)
		},
		async removeMessage (payload) {
			return this.__deleteEntityWithoutMutation(
				`/core/issue-messages/${payload.id}/`
			)
		},
		async getSprintGuideline () {
			const sprint = this.$store.getters['core/SPRINT_STARTED_BY_CURRENT_PROJECT']

			try {
				const responseGuideline = await this.$http
					.auth(true)
					.expect(200)
					.get(
						`/core/sprint-guideline/${sprint.id}/`
					)

				this.$store.commit('current/UPDATE_SPRINT_GUIDELINE', responseGuideline.data)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async getSprintRemaining () {
			const sprint = this.$store.getters['core/SPRINT_STARTED_BY_CURRENT_PROJECT']

			try {
				const responseRemaining = await this.$http
					.auth(true)
					.expect(200)
					.get(
						`/core/sprint-efforts-history/?sprint=${sprint.id}`
					)

				this.$store.commit('current/UPDATE_SPRINT_REMAINING', responseRemaining.data)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		}
	}
}
