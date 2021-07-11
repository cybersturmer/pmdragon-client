import { LocalStorage } from 'quasar'
import { empty } from './presets'

export function ACTIVATE (state) {
	state.enabled = true
	LocalStorage.set('connection.enabled', true)
}

export function SET_HOST (state, payload) {
	state.host = payload
	LocalStorage.set('connection.host', payload)
}

export function RESET (state) {
	const localStorageResetList = [
		'host',
		'socketRequestId',
		'socketConnected',
		'socketReconnectError',
		'socketMessage'
	]

	for (const element of localStorageResetList) {
		LocalStorage.remove(`connection.${element}`)
	}

	Object.assign(state, empty())
}

export function SOCKET_ONOPEN (state, event) {
	state.socketConnected = true
}

export function SOCKET_ONCLOSE (state, event) {
	state.socketConnected = false
}

export function SOCKET_ONERROR (state, event) {
	console.error(state, event)
}

export function SOCKET_ONMESSAGE (state, message) {
	state.socketMessage = message
}

export function SOCKET_RECONNECT (state, count) {
	console.info(`Reconnecting... ${count}`)
}

export function SOCKET_RECONNECT_ERROR (state) {
	state.socketReconnectError = true
}

export function UPDATE_SOCKET_REQUEST_ID (state) {
	state.socketRequestId++
}
