import { boot } from 'quasar/wrappers'

import { setPageTitleMiddleware } from 'src/router/middlewares'

export default boot(({ router, store, Vue }) => {
	router.beforeEach(setPageTitleMiddleware)
})
