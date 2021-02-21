import { LocalStorage } from 'quasar'

export function SET_HOST (state, payload) {
  state.host = payload
  LocalStorage.set('connection.host', payload)
}

export function RESET () {
  const localStorageResetList = [
    'host'
  ]

  for (const element of localStorageResetList) {
    LocalStorage.remove(`connection.${element}`)
  }
}

export function SOCKET_ONOPEN (state, event) {
  state.socket.connected = true
}

export function SOCKET_ONCLOSE (state, event) {
  state.socket.connected = false
}

export function SOCKET_ONERROR (state, event) {
  console.error(state, event)
}

export function SOCKET_ONMESSAGE (state, message) {
  state.socket.message = message
}

export function SOCKET_RECONNECT (state, count) {
  console.info(state, count)
}

export function SOCKET_RECONNECT_ERROR (state) {
  state.socket.reconnectError = true
}
