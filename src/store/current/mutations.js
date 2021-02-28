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

export function SET_ISSUE (state, payload) {
  state.issue = payload
  LocalStorage.set('current.issue', payload)
}

export function SET_ISSUE_MESSAGES (state, payload) {
  state.issue_messages = payload
  LocalStorage.set('current.issue_messages', payload)
}

export function SET_ISSUE_HISTORY (state, payload) {
  state.issue_history = payload
  LocalStorage.set('current.issue_history', payload)
}

export function RESET () {
  const localStorageResetList = [
    'workspace',
    'project',
    'issue',
    'issue_messages'
  ]

  for (const element of localStorageResetList) {
    LocalStorage.remove(`current.${element}`)
  }
}
