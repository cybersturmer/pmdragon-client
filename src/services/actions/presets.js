import { ErrorHandler } from 'src/services/util'

export const PresetsActionsMixin = {
	methods: {
		async __getEntities (endpoint, mutation) {
			try {
				const response =
					await this.$http
						.auth(true)
						.expect(200)
						.get(endpoint)

				this.$store.commit(mutation, response.data)
				return Promise.resolve(response)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async __addEntityWithoutMutation (endpoint, payload) {
			try {
				const response =
					await this.$http
						.auth(true)
						.expect(201)
						.post(
							endpoint,
							payload
						)

				return Promise.resolve(response)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async __addEntity (endpoint, payload, mutation) {
			const response = await this.__addEntityWithoutMutation(endpoint, payload)
			this.$store.commit(mutation, response.data)
			return Promise.resolve(response)
		},
		async __patchEntity (endpoint, payload, mutation) {
			try {
				const response =
					await this.$http
						.auth(true)
						.expect(200)
						.patch(
							endpoint,
							payload
						)

				this.$store.commit(mutation, response.data)
				return Promise.resolve(response)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async __deleteEntityWithoutMutation (endpoint) {
			try {
				const response = await this.$http
					.auth(true)
					.expect(204)
					.delete(
						endpoint
					)
				return Promise.resolve(response)
			} catch (e) {
				throw new ErrorHandler(e)
			}
		},
		async __deleteEntity (endpoint, payload = null, mutation) {
			const response = await this.__deleteEntityWithoutMutation(endpoint)

			payload ? this.$store.commit(mutation, payload) : this.$store.commit(mutation)
			return Promise.resolve(response)
		}
	}
}
