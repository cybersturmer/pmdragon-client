import { ErrorHandler } from 'src/services/util'

export const CurrentActionsMixin = {
	methods: {
		async removeMessage (payload) {
			try {
				const response =
					await this.$http
						.auth(true)
						.expect(204)
						.delete(`/core/issue-messages/${payload.id}/`)
				/** We dot need to commit it, cause we have socket connection for it
				 * Look here for more information src/services/websockets/stream/IssueChat.js **/
				return Promise.resolve(response)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		}
	}
}
