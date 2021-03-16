<template>
  <q-page class="q-pa-lg">
  </q-page>
</template>

<script>
import { loading } from 'pages/mixins/loading'

export default {
  name: 'LoadingView',
  mixins: [loading],
  data () {
    return {
      module: 'data'
    }
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
      .finally(() => {
        this.hideProgress()
        if (!this.$store.getters['auth/IS_MY_DATA_FILLED']) this.$router.push({ name: 'kickstart' })
        this.$router.push({ name: 'workspaces' })
      })
  }
}
</script>
