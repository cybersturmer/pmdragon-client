<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          v-if="isWorkspaceSelected"
          flat
          dense
          round
          icon="mdi-menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title shrink class="q-pa-xs">
          {{ toolbarText }}
        </q-toolbar-title>
        <q-btn
          v-if="isWorkspaceSelected && isMeOwnerOfCurrentProject"
          flat
          dense
          round
          icon="mdi-tune"
          @click="goToSettingsOfProject"
          title="Manage project"/>
        <q-space/>
        <q-btn
          flat
          round
          dense
          icon="mdi-swap-horizontal"
          class="q-mr-xs"
					title="Workspaces and projects"
          @click="goToWorkspaces"/>
				<q-btn
					flat
					round
					dense
					icon="mdi-cloud-refresh"
					title="Manually refresh data"
					class="q-mr-xs"
					@click="refreshManually"/>
        <q-btn
          flat
          round
          dense
          icon="mdi-account"
					title="Account and Settings"
          class="q-mr-xs"
          @click="goToAccount"/>
        <q-btn
          flat
          round
          dense
          icon="mdi-exit-to-app"
          class="q-mr-xs"
          @click="logout"/>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="isWorkspaceSelected"
      v-model="leftDrawerOpen"
      show-if-above
      :width="200"
      :breakpoint="600"
      bordered>
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px;" class="no-scroll">
        <q-list separator
								class="q-pa-md"
								style="border-top: 1px solid #5f5f5f; border-bottom: 1px solid #5f5f5f">
          <q-item clickable v-ripple :to="{ name: 'backlog' }">
            <q-item-section avatar>
              <q-icon name="mdi-view-list" />
            </q-item-section>

            <q-item-section>
              Backlog
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple :to="{ name: 'board' }">
            <q-item-section avatar>
              <q-icon name="mdi-view-dashboard" />
            </q-item-section>

            <q-item-section>
              Board
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple :to="{ name: 'team'}">
            <q-item-section avatar>
              <q-icon name="mdi-account-multiple" />
            </q-item-section>

            <q-item-section>
              Team
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple :to="{ name: 'overview'}">
            <q-item-section avatar>
              <q-icon name="mdi-chart-bar" />
            </q-item-section>

            <q-item-section>
              Overview
            </q-item-section>
          </q-item>

        </q-list>
      </q-scroll-area>

      <q-card square flat class="absolute-top" style="height: 150px;">
        <div class="absolute-bottom text-center" style="margin-bottom: 1em;">
          <q-avatar v-if="avatarUrl" size="65px" class="q-mb-sm">
            <q-badge
              rounded
              floating
              :color="connectionColor"
              :title="connectedText"
              class="connection-state">
            </q-badge>
            <img :src="avatarUrl">
          </q-avatar>
          <div class="text-subtitle2">{{ firstName }} {{ lastName }}</div>
          <div>
            <q-badge outline color="grey-6" :label="`@${username}`" />
          </div>
        </div>
      </q-card>
    </q-drawer>

    <q-page-container>
      <keep-alive>
        <router-view />
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>

<script>

import { WsController } from 'src/services/websockets/WsController'
import { Notifications } from 'src/pages/mixins/notifications'
import { websocket } from 'src/pages/mixins/websockets'
import { loading } from 'src/pages/mixins/loading'

export default {
	name: 'DashLayout',
	mixins: [
		websocket,
		loading,
		Notifications
	],
	data () {
		return {
			leftDrawerOpen: false,
			websocketConfiguration: {
				store: this.$store,
				reconnection: true,
				reconnectionDelay: 3000,
				format: 'json',
				passToStoreHandler (eventName, event) {
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
		}
	},
	watch: {
		isVisible (newState, oldState) {
			const payload = {
				event: 'visibility',
				timestamp: Date.now(),
				value: newState
			}

			this.$store.commit('current/APPEND_LOG', payload)

			if (newState && !oldState) { this.reloadData() }
		}
	},
	created () {
		/** Socket manual connection **/
		const target = this.$store.getters['connection/SOCKET_ENDPOINT_WITH_TOKEN']
		this.$connect(target, this.websocketConfiguration)

		this.$options.sockets.onmessage = (data) => {
			const handler = new WsController()
			handler.processEvent(data)
		}
	},
	methods: {
		logout () {
			// Disconnect from sockets first (we use auth credentials to connect websockets)
			this.$disconnect()

			this.$store.dispatch('auth/RESET')
			this.$store.dispatch('current/RESET')
			this.$store.dispatch('core/RESET')
			this.$router.push({ name: 'login' })
		},
		goToAccount () {
			if (this.$router.currentRoute.name === 'me') return false
			this.$router.push({ name: 'me' })
		},
		refreshManually () {
			this.reloadData()
		},
		goToWorkspaces () {
			if (this.$router.currentRoute.name === 'workspaces') return false
			this.$store.dispatch('current/RESET_WORKSPACE')
			this.$store.dispatch('current/RESET_PROJECT')
			this.$router.push({ name: 'workspaces' })
		},
		goToSettingsOfProject () {
			this.$router.push({ name: 'settings' })
		}
	},
	computed: {
		isVisible () {
			return this.$q.appVisible
		},
		toolbarText () {
			const workspaceName = this.$store.getters['current/WORKSPACE']
			const project = this.$store.getters['current/PROJECT']

			if (workspaceName && project) {
				const projectTitle = this.$store.getters['auth/PROJECT_KEY']
				return `${workspaceName} [ ${projectTitle} ]`
			}

			return '  PmDragon'
		},
		firstName () {
			return this.$store.getters['auth/MY_FIRST_NAME']
		},
		lastName () {
			return this.$store.getters['auth/MY_LAST_NAME']
		},
		username () {
			return this.$store.getters['auth/MY_USERNAME']
		},
		connected () {
			return this.$store.getters['connection/SOCKET_CONNECTED']
		},
		connectionError () {
			return this.$store.getters['connection/SOCKET_RECONNECT_ERROR']
		},
		connectedText () {
			switch (!!this.connected) {
			case true: return 'Connected'
			case false:
				return this.connectionError ? 'No connection' : 'Disconnected'
			}
			return ''
		},
		connectionColor () {
			switch (this.connectedText) {
			case 'Connected': return 'positive'
			default: return 'negative'
			}
		},
		avatarUrl () {
			return this.$store.getters['auth/MY_AVATAR']
		},
		isMeOwnerOfCurrentProject () {
			return this.$store.getters['auth/IS_ME_OWNER_OF_PROJECT']
		},
		isWorkspaceSelected () {
			return this.$store.getters['current/WORKSPACE']
		}
	}
}
</script>

<style lang="scss" scoped>
	.q-layout__section--marginal {
		background-color: var(--q-color-dark);
	}

	.q-drawer {
		background-color: var(--q-color-dark)!important;
	}

  .q-toolbar__title {
    font-size: 18px;
  }
  .q-toolbar__title:first-child {
    padding-left: 1em;
  }

  .text-h6 {
    font-size: 1.25rem;
  }

  .header-image {
    height: 100%;
    z-index: -1;
    opacity: 0.1;
    filter: grayscale(100%);
  }

  .q-img__content > div {
    padding: 0.5rem;
  }

  .q-field--dark .q-field__native,
  .q-field--dark .q-field__prefix,
  .q-field--dark .q-field__suffix,
  .q-field--dark .q-field__input {
    font-weight: bold;
  }

  .connection-state {
    height: 12px;
    width: 12px;
    top: 55px;
    right: 15px;
    border-radius: 15px;
  }
</style>
