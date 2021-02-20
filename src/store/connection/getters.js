export function REST_ENDPOINT (state) {
  const protocol = process.env.DEV ? 'http' : 'https'
  return `${protocol}://${state.host}/api`
}

export function SOCKET_ENDPOINT (state) {
  return `wss://${state.host}/ws`
}

export function HOST (state) {
  return state.host
}
