<template>
  <q-page class="q-pa-lg">
  </q-page>
</template>

<script>
import { QSpinnerGears } from 'quasar'

export default {
  name: 'LoadingView',
  data () {
    return {
      module: 'data'
    }
  },
  computed: {
    loadingText () {
      return `Loading ${this.module}...`
    }
  },
  methods: {
    showProgress () {
      this.$q.loading.show({
        message: this.$store.getters['current/LOADING_TEXT'],
        spinner: QSpinnerGears
      })
    },
    hideProgress () {
      this.$q.loading.hide()
    }
  },
  mounted () {
    this.showProgress()

    if (!this.$store.getters['auth/IS_MY_DATA_FILLED']) {
      return this.$router.push({ name: 'kickstart' })
    } else {
      this.$router.push({ name: 'workspaces' })
    }

    this.hideProgress()
  }
}
</script>
