import Vue from 'vue'
import VueRouter from 'vue-router'
import $store from 'src/store'

import routes from './routes'
import VueMoment from 'vue-moment'
import VueNativeSock from 'vue-native-websocket'
import moment from 'moment-timezone'

Vue.use(VueRouter)
Vue.use(VueMoment, {
  moment
})
Vue.use(
  VueNativeSock,
  $store.getters['connection/SOCKET_ENDPOINT'],
  {
    store: $store,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
    format: 'json',
    passToStoreHandler (eventName, event, next) {
      if (!eventName.startsWith('SOCKET_')) { return null }

      const namespace = 'connection'
      let target = ['connection', eventName.toUpperCase()].join('/')
      let method = 'commit'
      let msg = event

      if (event.data) {
        msg = JSON.parse(event.data)
        if (msg.mutation) {
          target = [namespace, msg.mutation].join('/')
        } else if (msg.action) {
          method = 'dispatch'
          target = [namespace, msg.action].join('/')
        }
      }

      this.store[method](target, msg)
    }
  }
)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  return Router
}
