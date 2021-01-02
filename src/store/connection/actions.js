export function UPDATE_HOST ({ commit }, payload) {
  commit('SET_HOST', payload)
}

export async function RESET ({ commit }) {
  commit('RESET')
}
