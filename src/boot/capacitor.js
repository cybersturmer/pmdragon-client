import { boot } from 'quasar/wrappers'

import * as Sentry from '@sentry/capacitor'

export default boot(() => {
	Sentry.init({
		dsn: 'https://ebba8af7e8c94e90b12145c692617bf9@o514097.ingest.sentry.io/6202017',
		release: 'pmdragon-mobile-application@' + process.env.npm_package_version,
		dist: '2'
	})
})
