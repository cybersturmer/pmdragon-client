import { LocalStorage } from 'quasar'
import { empty } from './presets'

export function ACTIVATE (state) {
	state.enabled = true
	LocalStorage.set('current.enabled', true)
}

export function SET_DARK_MODE (state, payload) {
	state.dark = payload
	LocalStorage.set('current.dark', payload)
}

export function APPEND_LOG (state, payload) {
	state.log.push(payload)
}

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

export function SET_LOADING_MODULE (state, payload) {
	state.loading_module = payload
}

export function SET_ISSUE_ID (state, payload) {
	state.issue_id = payload
	LocalStorage.set('current.issue_id', payload)
}

export function SET_ISSUE_MESSAGES (state, payload) {
	state.issue_messages = payload
	LocalStorage.set('current.issue_messages', payload)
}

export function SET_ISSUE_HISTORY (state, payload) {
	state.issue_history = payload
	LocalStorage.set('current.issue_history', payload)
}

export function SET_ISSUE_IN_WORKSPACE_SUBSCRIBED (state, payload) {
	state.issue_in_workspace_subscribed = payload
}

export function RESET (state) {
	/** loading and loading_module are not stored in LC
   * So we don't need to clean it **/
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

	Object.assign(state, empty())
}
