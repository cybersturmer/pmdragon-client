export function UPDATE_HOST ({ commit }, payload) {
  commit('SET_HOST', payload)
}

export async function RESET ({ commit }) {
  commit('RESET')
}

export async function UPDATE_REQUEST_ID ({ commit }) {
  commit('UPDATE_SOCKET_REQUEST_ID')
}
