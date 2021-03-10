export function SELECT_WORKSPACE ({ commit }, payload) {
  commit('SELECT_WORKSPACE', payload)
}

export function SELECT_PROJECT ({ commit }, payload) {
  commit('SELECT_PROJECT', payload)
}

export function START_LOADING ({ commit }, message) {
  commit('SET_LOADING_STATE', true)
  commit('SET_LOADING_TEXT', message)
}

export function STOP_LOADING ({ commit }) {
  commit('SET_LOADING_STATE', false)
  commit('SET_LOADING_TEXT', null)
}

export function SET_ISSUE ({ commit }, payload) {
  commit('SET_ISSUE', payload)
}

export function SET_ISSUE_MESSAGES ({ commit }, payload) {
  commit('SET_ISSUE_MESSAGES', payload)
}

export function SET_ISSUE_HISTORY ({ commit }, payload) {
  commit('SET_ISSUE_HISTORY', payload)
}

export function RESET_ISSUE ({ commit }) {
  commit('SET_ISSUE', null)
}

export function RESET_ISSUE_MESSAGES ({ commit }) {
  commit('SET_ISSUE_MESSAGES', null)
}

export function RESET_ISSUE_HISTORY ({ commit }) {
  commit('SET_ISSUE_HISTORY', null)
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
