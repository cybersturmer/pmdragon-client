import { boot } from 'quasar/wrappers'

import { setPageTitleMiddleware } from 'src/router/middlewares'

export default boot(({ router }) => {
	router.beforeEach(setPageTitleMiddleware)
})
