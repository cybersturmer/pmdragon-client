import { LocalStorage } from 'quasar'

export function SET_HOST (state, payload) {
  state.url = payload
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
