import { LocalStorage } from 'quasar'
import { DEBUG_ENV, PROD_ENV } from 'src/.env'

function getDefaultEnv () {
	return process.env.DEV ? DEBUG_ENV : PROD_ENV
}

export const empty = () => {
	return {
		enabled: false,
		host: LocalStorage.getItem('connection.host') || getDefaultEnv(),
		socketConnected: false,
		socketReconnectError: false,
		socketMessage: '',
		socketRequestId: 0
	}
}

export const restored = () => {
	return {
		enabled: LocalStorage.getItem('connection.enabled'),
		host: LocalStorage.getItem('connection.host'),
		socketConnected: false,
		socketReconnectError: false,
		socketMessage: '',
		socketRequestId: 0
	}
}
