import { ErrorHandler } from 'src/services/util'

export const ConnectionActionsMixin = {
	methods: {
		async check () {
			try {
				const response =
					await this.$http
						.auth(false)
						.expect(200)
						.get('/check/')

				return Promise.resolve(response)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		}
	}
}
