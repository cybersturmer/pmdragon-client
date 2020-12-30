import { LocalStorage } from 'quasar'

// Workspaces managing
export function SELECT_WORKSPACE (state, payload) {
  state.workspace = payload
  LocalStorage.set('current.workspace', payload)
}

export function RESET_WORKSPACE (state) {
  state.workspace = null
  LocalStorage.remove('current.workspace')
}

// Project managing
export function RESET_PROJECT (state) {
  state.project = null
  LocalStorage.remove('current.project')
}

export function SELECT_PROJECT (state, payload) {
  state.project = payload
  LocalStorage.set('current.project', payload)
}

// Settings managing
export function SELECT_INTERFACE_THEME (state, payload) {
  state.interface_theme = payload
  LocalStorage.set('current.interface_theme', payload)
}

export function RESET () {
  const localStorageResetList = [
    'workspace',
    'project',
    'interface_theme'
  ]

  for (const element of localStorageResetList) {
    LocalStorage.remove(`current.${element}`)
  }
}
