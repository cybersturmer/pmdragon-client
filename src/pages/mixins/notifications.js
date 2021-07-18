export const Notifications = {
	methods: {
		showInformalNotification (message) {
			this.$q.notify({
				position: 'top',
				message: message,
				color: 'primary'
			})
		}
	}
}
