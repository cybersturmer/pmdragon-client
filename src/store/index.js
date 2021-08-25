import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'
import auth from './auth'
import current from './current'
import core from './core'
import connection from './connection'

// import example from './module-example'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
	return createStore({
		modules: {
			connection,
			auth,
			current,
			core
		},
		strict: process.env.DEBUGGING
	})
})
