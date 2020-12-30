import { isURLValid } from 'src/services/util'

export async function UPDATE_CONNECTION ({ commit }, payload) {
  if (!isURLValid(payload)) return false
  commit('SET_HOST', payload)
}

export async function RESET ({ commit }) {
  commit('RESET')
}
