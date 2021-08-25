import moment from 'moment'
import { boot } from 'quasar/wrappers'

export default boot(({ app }) => {
	app.config.globalProperties.$moment = moment
})
