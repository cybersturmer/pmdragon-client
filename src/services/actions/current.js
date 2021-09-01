import { PresetsActionsMixin } from 'src/services/actions/presets'

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
			return this.__addEntity(
				'/core/issue-messages/',
				payload,
				'current/ADD_ISSUE_MESSAGE'
			)
		},
		async updateMessage (payload) {
			return this.__patchEntity(
				`/core/issue-messages/${payload.id}/`,
				payload,
				'current/UPDATE_ISSUE_MESSAGE'
			)
		},
		async removeMessage (payload) {
			return this.__deleteEntityWithoutMutation(
				`/core/issue-messages/${payload.id}/`
			)
		}
	}
}
