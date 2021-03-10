import { LocalStorage } from 'quasar'
import { removeElementById, updateElementById } from 'src/services/util'

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

export function SET_LOADING_STATE (state, payload) {
  state.loading = payload
}

export function SET_LOADING_TEXT (state, payload) {
  state.loading_text = payload
}

export function SET_ISSUE (state, payload) {
  state.issue = payload
  LocalStorage.set('current.issue', payload)
}

export function SET_ISSUE_MESSAGES (state, payload) {
  state.issue_messages = payload
  LocalStorage.set('current.issue_messages', payload)
}

export function ADD_ISSUE_MESSAGE (state, payload) {
  state.issue_messages.push(payload)
  LocalStorage.set('current.issue_messages', state.issue_messages)
}

export function UPDATE_ISSUE_MESSAGE (state, payload) {
  updateElementById(state.issue_messages, payload)
  LocalStorage.set('current.issue_messages', state.issue_messages)
}

export function DELETE_ISSUE_MESSAGE (state, payload) {
  removeElementById(state.issue_messages, payload)
  LocalStorage.set('current.issue_messages', state.issue_messages)
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
    'issue_messages',
    'issue_history'
  ]

  for (const element of localStorageResetList) {
    LocalStorage.remove(`current.${element}`)
  }
}
