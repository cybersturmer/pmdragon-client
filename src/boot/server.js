import axios from 'axios'
import { boot } from 'quasar/wrappers'
import createAuthRefreshInterceptor from 'axios-auth-refresh'

class Http {
	constructor ($store) {
		this.$store = $store // Vuex Storage

		this.expectedStatus = false
		this.authRequired = false

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

		this.instance = axios.create(this.axiosOptions)

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

	generateAuthHeader () {
		return `Bearer ${this.$store.getters['auth/ACCESS_TOKEN']}`
	}

	expect (expectedStatus) {
		this.expectedStatus = expectedStatus
		return this
	}

	auth (authRequired) {
		this.authRequired = authRequired

		if (this.authRequired) {
			this.axiosOptions.headers = {
				Authorization: this.generateAuthHeader()
			}
		}

		return this
	}

	do () {
		return this.instance
	}

	validateStatus (status) {
		return this.expectedStatus ? this.expectedStatus === status : true
	}

	refreshTokens (failedRequest) {
		if (failedRequest.config.url === '/auth/obtain/') { return Promise.reject(failedRequest) }

		return this.$store.dispatch('auth/REFRESH')
	}
}

export default boot(({ app, store }) => {
	app.$axios = axios
	app.$http = new Http(store)
})
