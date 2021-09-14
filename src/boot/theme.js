import { boot } from 'quasar/wrappers'

export default boot(({ app, store }) => {
	/** Set Theme active for user by current settings */
	const isDarkInSettings = store.getters['current/IS_DARK']
	app.config.globalProperties.$q.dark.set(isDarkInSettings)
})
