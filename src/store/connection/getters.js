export function REST_ENDPOINT (state) {
  return `https://${state.host}/api`
}

export function SOCKET_ENDPOINT (state) {
  return `wss://${state.host}/ws`
}

export function HOST (state) {
  return state.host
}
