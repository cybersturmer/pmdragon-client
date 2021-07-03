import { QSpinnerOrbit } from 'quasar'

export const loading = {
	computed: {
		loadingText () {
			return this.$store.getters['current/LOADING_TEXT']
		}
	},
	methods: {
		loadData () {
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
				.catch((e) => {
					this.showError(e)
				})
				.finally(() => {
					// Hide preloader
					this.hideProgress()

					// If UserData is incomplete -> let's route him on kickstart page
					if (this.$store.getters['auth/IS_MY_DATA_INCOMPLETE']) {
						this.$router.push({ name: 'kickstart' })
					}

					// If workspace is not defined, then we redirect him/her on the Workspace selection page
					if (!this.$store.getters['current/IS_WORKSPACE']) {
						this.$router.push({ name: 'workspaces' })
					}
				})
		},
		reloadData () {
			return this.loadData()
		},
		showProgress () {
			this.$q.loading.show({
				message: this.loadingText,
				spinner: QSpinnerOrbit
			})
		},
		hideProgress () {
			this.$store.dispatch('current/STOP_LOADING')
				.then(r => this.$q.loading.hide())
		}
	}
}
