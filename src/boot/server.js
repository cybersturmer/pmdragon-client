import axios from 'axios'
import { boot } from 'quasar/wrappers'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import { ErrorHandler } from 'src/services/util'

class Http {
	constructor ($store) {
		this.$store = $store // Vuex Storage

		this.expectedStatus = false
		this.authRequired = false

		this.updateOptions()

		this.axiosOptions = {
			baseURL: this.$store.getters['connection/REST_ENDPOINT'],
			withCredentials: false,
			validateStatus: (status) => this.validateStatus(status)
		}

		const refreshAuth = (failedRequest) =>
			this.refreshTokens(failedRequest)
				.then((tokenRefreshResponse) => {
					failedRequest.response.config.headers.Authorization = this.generateAuthHeader()

					return Promise.resolve()
				})

		this.createInstance()

		createAuthRefreshInterceptor(
			this.instance,
			refreshAuth,
			{
				statusCodes: [401],
				retryInstance: this.instance,
				interceptNetworkError: false
			}
		)

		return this
	}

	updateOptions () {
		this.axiosOptions = {
			baseURL: this.$store.getters['connection/REST_ENDPOINT'],
			withCredentials: false,
			validateStatus: (status) => this.validateStatus(status)
		}
	}

	createInstance () {
		this.instance = axios.create(this.axiosOptions)
	}

	generateAuthHeader () {
		return `Bearer ${this.$store.getters['auth/ACCESS_TOKEN']}`
	}

	expect (expectedStatus) {
		this.expectedStatus = expectedStatus
		return this.instance
	}

	auth (authRequired) {
		this.authRequired = authRequired

		if (this.authRequired) {
			this.instance.defaults.headers = {
				Authorization: this.generateAuthHeader()
			}
		}

		return this
	}

	async chain (preset, payload) {
		const { auth, expect, method, endpoint } = preset

		return this
			.auth(auth)
			.expect(expect)[method](
				endpoint,
				payload
			)
	}

	validateStatus (status) {
		return this.expectedStatus ? this.expectedStatus === status : true
	}

	async obtainTokens (payload) {
		try {
			const response =
				await this
					.auth(false)
					.expect(200)
					.post(
						'/auth/obtain/',
						payload
					)

			this.$store.commit('auth/SET_TOKENS', response.data)
		} catch (e) {
			throw new ErrorHandler(e)
		}
	}

	async refreshTokens (failedRequest = null) {
		if (failedRequest && failedRequest.config.url === '/auth/obtain/') { return Promise.reject(failedRequest) }

		const payload = {
			refresh: this.$store.getters['auth/REFRESH_TOKEN']
		}

		try {
			const response =
				await this
					.auth(false)
					.expect(200)
					.post(
						'/auth/refresh/',
						payload
					)

			this.$store.commit('auth/SET_TOKENS', response.data)
			return Promise.resolve(response)
		} catch (e) {
			throw new ErrorHandler(e)
		}
	}
}

export default boot(({ app, store }) => {
	app.config.globalProperties.$axios = axios
	app.config.globalProperties.$http = new Http(store)
})
