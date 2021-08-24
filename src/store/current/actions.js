import { empty } from 'src/store/current/presets'

export function SELECT_WORKSPACE ({ commit }, payload) {
	commit('SELECT_WORKSPACE', payload)
}

export function SELECT_PROJECT ({ commit }, payload) {
	commit('SELECT_PROJECT', payload)
}

export function START_LOADING ({ commit }, message) {
	commit('SET_LOADING_STATE', true)
	commit('SET_LOADING_MODULE', message)
}

export function STOP_LOADING ({ commit }) {
	commit('SET_LOADING_STATE', false)
	commit('SET_LOADING_MODULE', null)
}

export function SET_ISSUE_ID ({ commit }, payload) {
	commit('SET_ISSUE_ID', payload)
}

export function SET_ISSUE_MESSAGES ({ commit }, payload) {
	commit('SET_ISSUE_MESSAGES', payload)
}

export function SET_ISSUE_HISTORY ({ commit }, payload) {
	commit('SET_ISSUE_HISTORY', payload)
}

export function RESET_ISSUE_SELECTION ({ commit }) {
	commit('SET_ISSUE_ID', empty().issue_id)
	commit('SET_ISSUE_MESSAGES', empty().issue_messages)
	commit('SET_ISSUE_HISTORY', empty().issue_history)
}

export function RESET ({ commit }) {
	commit('RESET')
}

export function RESET_WORKSPACE ({ commit }) {
	commit('RESET_WORKSPACE')
}

export function RESET_PROJECT ({ commit }) {
	commit('RESET_PROJECT')
}
