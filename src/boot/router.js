import { boot } from 'quasar/wrappers'

export default boot(({ router, store }) => {
	const isLoggedIn = store.getters['auth/IS_LOGGED_IN']
	const isWorkspaceDefined = store.getters['current/IS_SPACE_DEFINED']

	router.beforeEach((to, from, next) => {
		// Is this route require authentication, should be defined in routes meta
		const isRouteRequireAuth = to.matched.some(item => item.meta.requiredAuth)

		// If this route need to have workspace defined
		const isWorkspaceRequired = to.matched.some(item => item.meta.requireSpace)

		// If User is logged in or page does not require auth
		const justLetUserGoAhead = (isLoggedIn || !isRouteRequireAuth) &&
			(isWorkspaceDefined || !isWorkspaceRequired)

		// Oh, we need workspace before continue
		const askUserToSelectWorkspace = !isWorkspaceDefined &&
			isWorkspaceRequired

		// Oh, we need user to login before continue
		const askAnonymousToLogIn = !isLoggedIn &&
			isRouteRequireAuth

		switch (true) {
		case justLetUserGoAhead:
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
