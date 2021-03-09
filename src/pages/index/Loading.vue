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
    showProgress (module) {
      this.module = module
      this.$q.loading.show({
        message: this.loadingText,
        spinner: QSpinnerGears
      })
    },
    hideProgress () {
      this.$q.loading.hide()
    },
    load () {
      return new Promise((resolve, reject) => {
        this.showProgress('workspaces')
        this.$store.dispatch('auth/INIT_WORKSPACES')
          .then(() => {
            this.showProgress('persons')
            return this.$store.dispatch('auth/INIT_PERSONS')
          })
          .then(() => {
            this.showProgress('issue states')
            return this.$store.dispatch('core/INIT_ISSUE_STATES')
          })
          .then(() => {
            this.showProgress('issue types')
            return this.$store.dispatch('core/INIT_ISSUE_TYPES')
          })
          .then(() => {
            this.showProgress('issue type icons')
            return this.$store.dispatch('core/INIT_ISSUE_TYPE_ICONS')
          })
          .then(() => {
            this.showProgress('issue estimations')
            return this.$store.dispatch('core/INIT_ISSUE_ESTIMATIONS')
          })
          .then(() => {
            this.showProgress('sprint durations')
            return this.$store.dispatch('core/INIT_SPRINT_DURATIONS')
          })
          .then(() => {
            this.showProgress('issues')
            return this.$store.dispatch('core/INIT_ISSUES')
          })
          .then(() => {
            this.showProgress('issue attachments')
            return this.$store.dispatch('core/INIT_ATTACHMENTS')
          })
          .then(() => {
            this.showProgress('sprints')
            return this.$store.dispatch('core/INIT_SPRINTS')
          })
          .then(() => {
            this.showProgress('backlogs')
            return this.$store.dispatch('core/INIT_BACKLOGS')
          })
          .then(() => {
            this.showProgress('invited')
            return this.$store.dispatch('auth/INIT_INVITED')
          })
          .then(() => {
            return resolve('Loaded successfully')
          })
          .catch((e) => {
            return reject(e)
          })
      })
    }
  },
  mounted () {
    this.showProgress()
    this.load()
      .then(() => {
        /**
         * Do this person need a kickstart helper **/
        const isUserDataEmpty = !this.$store.getters['auth/IS_MY_DATA_FILLED']
        if (isUserDataEmpty) return this.$router.push({ name: 'kickstart' })
        else this.$router.push({ name: 'workspaces' })
      })
      .catch((e) => {
        this.$q.dialog({
          title: 'Error',
          message: 'Error occurred while loading.'
        })

        console.log(e)
      })
      .finally(() => {
        this.hideProgress()
      })
  }
}
</script>
