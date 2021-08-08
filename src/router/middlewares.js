export function setPageTitleMiddleware (to, from, next) {
	const pageTitle = to.matched.find(item => item.meta.title)
	 if (pageTitle) { window.document.title = pageTitle.meta.title }
	 next()
}
