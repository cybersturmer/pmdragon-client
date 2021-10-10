import { QSpinnerPuff } from 'quasar'
import { Dialogs } from './dialogs'
import { CoreActionsMixin } from 'src/services/actions/core'
import { AuthActionsMixin } from 'src/services/actions/auth'

export const loading = {
	mixins: [
		Dialogs,
		CoreActionsMixin,
		AuthActionsMixin
	],
	computed: {
		loadingText () {
			return this.$store.getters['current/LOADING_TEXT']
		}
	},
	methods: {
		async loadData () {
			this.showProgress()

			this.$store.commit('current/APPEND_LOG', {
				event: 'load_data',
				timestamp: Date.now(),
				value: 'started'
			})

			this.$store.dispatch('current/START_LOADING', 'Loading data...')
				.then(() => this.refreshTokens())
				.then(() =>
					Promise.all([
						this.getWorkspaces(),
						this.getPersons(),
						this.getIssueStates(),
						this.getIssueTypes(),
						this.getIssueTypeIcons(),
						this.getIssueEstimations(),
						this.getSprintDurations(),
						this.getIssues(),
						this.getAttachments(),
						this.getSprints(),
						this.getBacklogs(),
						this.getInvited(),
						this.getWorkingDays()
					]))
				.catch((e) => {
					this.showError(e)

					this.$store.commit('current/APPEND_LOG', {
						event: 'load_data',
						timestamp: Date.now(),
						value: 'failed'
					})
				})
				.finally(() => {
					// Hide preloader
					this.hideProgress()

					this.$store.commit('current/APPEND_LOG', {
						event: 'load_data',
						timestamp: Date.now(),
						value: 'success'
					})

					// If UserData is incomplete -> let's route him on kickstart page
					if (this.$store.getters['auth/IS_MY_DATA_INCOMPLETE']) {
						this.$router.push({ name: 'kickstart' })
					}

					// If workspace is not defined, then we redirect him/her on the Workspace selection page
					if (!this.$store.getters['current/IS_SPACE_DEFINED']) {
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
				spinner: QSpinnerPuff
			})
		},
		hideProgress () {
			this.$store.dispatch('current/STOP_LOADING')
				.then(r => this.$q.loading.hide())
		}
	}
}
