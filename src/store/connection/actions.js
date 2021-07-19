import { Api } from 'src/services/api'
import { ErrorHandler } from 'src/services/util'

export function UPDATE_API_HOST ({ commit }, payload) {
	commit('SET_API_HOST', payload)
}

export async function RESET ({ commit }) {
	commit('RESET')
}

export async function UPDATE_REQUEST_ID ({ commit }) {
	commit('UPDATE_SOCKET_REQUEST_ID')
}

export async function CHECK () {
	try {
		await new Api({
			expectedStatus: 200
		})
			.get(
				'/check/'
			)
	} catch (e) {
		throw new ErrorHandler(e)
	}
}
