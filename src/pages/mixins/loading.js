import { QSpinnerTail } from 'quasar'

export const loading = {
	computed: {
		loadingText () {
			return this.$store.getters['current/LOADING_TEXT']
		}
	},
	methods: {
		showProgress () {
			this.$q.loading.show({
				message: this.loadingText,
				spinner: QSpinnerTail
			})
		},
		hideProgress () {
			this.$store.dispatch('current/STOP_LOADING')
				.then(r => this.$q.loading.hide())
		}
	}
}
