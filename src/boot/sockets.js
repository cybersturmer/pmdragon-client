import { boot } from 'quasar/wrappers'
import { ifFromNonAuthToAuth } from 'src/router/middlewares'
import VueNativeSock from 'vue-native-websocket-vue3'

export default boot(({ app, router, store }) => {
	router.afterEach((to, from) => {
		/** In some cases we don't need to establish connection one more time.
		 * So we need it only in case if we came from the place where
		 * websocket connection was not required and we go to place
		 * where connection is required. */

		if (!ifFromNonAuthToAuth(to, from)) return false

		const websocketConfiguration = {
			store,
			reconnection: true,
			reconnectionDelay: 3000,
			format: 'json',
			connectManually: false,
			passToStoreHandler (
				eventName,
				event
			) {
				if (!eventName.startsWith('SOCKET_')) { return null }

				const namespace = 'connection'
				let target = ['connection', eventName.toUpperCase()].join('/')
				let method = 'commit'
				let msg = event

				if (event.data) {
					msg = JSON.parse(event.data)
					if (msg.mutation) {
						target = [namespace, msg.mutation].join('/')
					} else if (msg.action) {
						method = 'dispatch'
						target = [namespace, msg.action].join('/')
					}
				}

				this.store[method](target, msg)
			}
		}

		const target = store.getters['connection/SOCKET_ENDPOINT_WITH_TOKEN']

		app.use(
			VueNativeSock,
			target,
			websocketConfiguration
		)
	})
})
