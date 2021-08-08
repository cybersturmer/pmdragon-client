import { boot } from 'quasar/wrappers'

export default boot(({ router, store }) => {
	router.beforeEach((to, from, next) => {
		const isLoggedIn = store.getters['auth/IS_LOGGED_IN']
		const isSpaceDefined = store.getters['current/IS_SPACE_DEFINED']

		// Is this route require authentication, should be defined in routes meta
		const isRouteRequireAuth = to.matched.some(item => item.meta.requiredAuth)

		// If this route need to have workspace defined
		const isSpaceRequired = to.matched.some(item => item.meta.requireSpace)

		// If User is logged in or page does not require auth
		const isWorkspacesPage = to.name === 'workspaces'
		const letUserGoAhead = (isLoggedIn || !isRouteRequireAuth) &&
			(isWorkspacesPage || isSpaceDefined || !isSpaceRequired)

		// Oh, we need workspace before continue
		const askUserToSelectWorkspace = !isSpaceDefined && isSpaceRequired

		// Oh, we need user to login before continue
		const askAnonymousToLogIn = !isLoggedIn && isRouteRequireAuth

		switch (true) {
		case letUserGoAhead:
			next()
			break
		case askUserToSelectWorkspace:
			next({ name: 'workspaces' })
			break
		case askAnonymousToLogIn:
			next({ name: 'login' })
			break
		}
	})
})
