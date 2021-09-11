export function setPageTitleMiddleware (to, from, next) {
	const pageTitle = to.matched.find(item => item.meta.title)
	 if (pageTitle) { window.document.title = pageTitle.meta.title }
	 next()
}

export function ifFromNonAuthToAuth (to, from) {
	/* If we came from path that was not defined (page was refreshed)
	*	 Or we came from the page that does not require auth */
	const fromNonAuth = from.name === undefined ||
		from.matched.find(item => item.meta.requiredAuth === false)

	/* If we gonna go to path that require Auth */
	const toAuth = to.matched.find(item => item.meta.requiredAuth === true)

	return fromNonAuth && toAuth
}
