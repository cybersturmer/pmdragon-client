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
		}
	}
}
