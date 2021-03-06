import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import current from './current'
import core from './core'
import connection from './connection'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default new Vuex.Store({
	modules: {
		connection,
		auth,
		current,
		core
	},

	// enable strict mode (adds overhead!)
	// for dev mode only
	strict: process.env.DEV
})
