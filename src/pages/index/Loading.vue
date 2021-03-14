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
      return this.$store.getters['current/LOADING_TEXT']
    }
  },
  methods: {
    showProgress () {
      this.$q.loading.show({
        message: this.loadingText,
        spinner: QSpinnerGears
      })
    },
    hideProgress () {
      this.$q.loading.hide()
    }
  },
  beforeRouteLeave (to, from, next) {
    this.$store.dispatch('current/START_LOADING', 'Loading data...')
      .then(() =>
        Promise.all([
          this.$store.dispatch('auth/INIT_WORKSPACES'),
          this.$store.dispatch('auth/INIT_PERSONS'),
          this.$store.dispatch('core/INIT_ISSUE_STATES'),
          this.$store.dispatch('core/INIT_ISSUE_TYPES'),
          this.$store.dispatch('core/INIT_ISSUE_TYPE_ICONS'),
          this.$store.dispatch('core/INIT_ISSUE_ESTIMATIONS'),
          this.$store.dispatch('core/INIT_SPRINT_DURATIONS'),
          this.$store.dispatch('core/INIT_ISSUES'),
          this.$store.dispatch('core/INIT_ATTACHMENTS'),
          this.$store.dispatch('core/INIT_SPRINTS'),
          this.$store.dispatch('core/INIT_BACKLOGS'),
          this.$store.dispatch('auth/INIT_INVITED')
        ]))
      .then(() => this.$store.dispatch('current/STOP_LOADING'))
      .then(() => next())
  },
  mounted () {
    this.showProgress()
    this.$store.dispatch('current/START_LOADING', 'Loading data...')
      .then(() =>
        Promise.all([
          this.$store.dispatch('auth/INIT_WORKSPACES'),
          this.$store.dispatch('auth/INIT_PERSONS'),
          this.$store.dispatch('core/INIT_ISSUE_STATES'),
          this.$store.dispatch('core/INIT_ISSUE_TYPES'),
          this.$store.dispatch('core/INIT_ISSUE_TYPE_ICONS'),
          this.$store.dispatch('core/INIT_ISSUE_ESTIMATIONS'),
          this.$store.dispatch('core/INIT_SPRINT_DURATIONS'),
          this.$store.dispatch('core/INIT_ISSUES'),
          this.$store.dispatch('core/INIT_ATTACHMENTS'),
          this.$store.dispatch('core/INIT_SPRINTS'),
          this.$store.dispatch('core/INIT_BACKLOGS'),
          this.$store.dispatch('auth/INIT_INVITED')
        ]))
      .then(() => this.$store.dispatch('current/STOP_LOADING'))
      .then(() => {
        this.hideProgress()
        if (!this.$store.getters['auth/IS_MY_DATA_FILLED']) this.$router.push({ name: 'kickstart' })
        this.$router.push({ name: 'workspaces' })
      })
  }
}
</script>
