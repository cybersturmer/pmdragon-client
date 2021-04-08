import {
	initCurrentUserStateMiddleware,
	checkAccessMiddleware,
	setPageTitleMiddleware,
	checkUsabilityMiddleware
} from '../router/middlewares'

export default ({ router, store, Vue }) => {
	router.beforeEach(initCurrentUserStateMiddleware)
	router.beforeEach(checkAccessMiddleware)
	router.beforeEach(setPageTitleMiddleware)
	router.beforeEach(checkUsabilityMiddleware)
}
