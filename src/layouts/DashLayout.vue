<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-9 text-white">
    <q-header elevated class="bg-primary">
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
        <q-toolbar-title :shrink="true" class="q-pa-xs">
          {{ toolbarText }}
        </q-toolbar-title>
        <q-btn
          v-if="isWorkspaceSelected && isMeOwnerOfCurrentProject"
          flat
          dense
          round
          icon="mdi-tune"
          @click="goToSettingsOfProject"
          title="Manage project"
        />
        <q-space/>
        <q-btn
          flat
          round
          dense
          icon="mdi-swap-horizontal"
          class="q-mr-xs"
          @click="goToWorkspaces"
        />
        <q-btn
          v-if="isWorkspaceSelected"
          flat
          round
          dense
          icon="mdi-account"
          class="q-mr-xs"
          @click="goToAccount"
        />
        <q-btn
          flat
          round
          dense
          icon="mdi-exit-to-app"
          class="q-mr-xs"
          @click="logout"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="isWorkspaceSelected"
      v-model="leftDrawerOpen"
      show-if-above
      :width="175"
      :breakpoint="600"
      content-class="bg-grey-8"
      bordered
    >
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px;">
        <q-list dark class="q-pa-md">
          <q-item clickable v-ripple to="/dash/backlog">
            <q-item-section avatar>
              <q-icon name="mdi-view-list" />
            </q-item-section>

            <q-item-section>
              Backlog
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/dash/board">
            <q-item-section avatar>
              <q-icon name="mdi-view-dashboard" />
            </q-item-section>

            <q-item-section>
              Board
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/dash/team">
            <q-item-section avatar>
              <q-icon name="mdi-account-multiple" />
            </q-item-section>

            <q-item-section>
              Team
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/dash/overview">
            <q-item-section avatar>
              <q-icon name="mdi-chart-bar" />
            </q-item-section>

            <q-item-section>
              Overview
            </q-item-section>
          </q-item>

        </q-list>
      </q-scroll-area>

      <q-card square flat class="absolute-top bg-grey-8" style="height: 150px;">
        <div class="absolute-bottom text-center bg-grey-8" style="margin-bottom: 1em;">
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
          <div class="text-h6">{{ firstName }} {{ lastName }}</div>
          <div><q-badge outline color="amber" :label="`@${username}`" /></div>
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

export default {
  name: 'DashLayout',
  data () {
    return {
      leftDrawerOpen: false
    }
  },
  created () {
    /** Socket manual connection **/
    this.$connect()
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
    toolbarText () {
      const workspaceName = this.$store.getters['current/WORKSPACE']
      const project = this.$store.getters['current/PROJECT']

      if (workspaceName && project) {
        const projectTitle = this.$store.getters['auth/PROJECT_TITLE']
        return `${workspaceName} - [ ${projectTitle} ]`
      }

      return '  PmDragon Community Edition'
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

<style lang="scss">
  .q-toolbar__title {
    font-size: 18px;
  }
  .q-toolbar__title:first-child {
    padding-left: 1em;
  }

  .q-drawer--left.q-drawer--bordered {
    border-color: #0f0f0f;
  }

  .text-h6 {
    font-size: 0.9rem;
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
