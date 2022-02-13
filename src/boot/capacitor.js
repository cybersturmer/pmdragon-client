import { boot } from 'quasar/wrappers'
import * as Sentry from '@sentry/capacitor'

export default boot(({ app }) => {
	Sentry.init({
		dsn: 'https://8410b5d5deb2408597d0e08c2a5cbeb1@o514097.ingest.sentry.io/6202017',
		release: 'pmdragon-mobile-application',
		dist: '2'
	})
})
