import { DEBUG } from 'src/.env'

export function REST_ENDPOINT (state) {
  const protocol = DEBUG ? 'http' : 'https'
  return `${protocol}://${state.host}/api`
}

export function SOCKET_ENDPOINT (state) {
  return `wss://${state.host}/ws`
}

export function HOST (state) {
  return state.host
}
