export function REST_ENDPOINT (state) {
	const protocol = process.env.DEV ? 'http' : 'https'
	return `${protocol}://${state.host}/api`
}

export function SOCKET_ENDPOINT (state) {
	const protocol = process.env.DEV ? 'ws' : 'wss'
	return `${protocol}://${state.host}/ws/`
}

export function SOCKET_ENDPOINT_WITH_TOKEN (state, getters, rootState, rootGetters) {
	return `${getters.SOCKET_ENDPOINT}?token=${rootGetters['auth/ACCESS_TOKEN']}`
}

export function HOST (state) {
	return state.host
}

export function SOCKET_CONNECTED (state) {
	return state.socketConnected
}

export function SOCKET_RECONNECT_ERROR (state) {
	return state.socketReconnectError
}

export function SOCKET_REQUEST_ID (state) {
	return state.socketRequestId
}
