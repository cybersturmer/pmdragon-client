import { ErrorHandler } from 'src/services/util'

export const Dialogs = {
	methods: {

		showOkDialog (
			title,
			message,
			unsafe = false
		) {
			return this.$q.dialog({
				dark: this.$q.dark.isActive,
				html: unsafe,
				title: title,
				message: message,
				ok: {
					label: 'OK',
					color: 'currentColor',
					outline: true
				}
			})
		},
		showOkCancelDialog (
			title,
			message,
			actionOk = 'OK',
			actionColor = 'normal',
			unsafe = false
		) {
			const colorOptions = {
				normal: 'secondary',
				danger: 'negative'
			}

			return this.$q.dialog({
				dark: this.$q.dark.isActive,
				title: title,
				message: message,
				html: unsafe,
				ok: {
					label: actionOk,
					color: colorOptions[actionColor]
				},
				cancel: {
					label: 'Cancel',
					color: 'secondary',
					flat: true
				},
				persistent: true
			})
		},
		showError (e) {
			if (!e.messageUseful) {
				console.log(e)
				return false
			}

			try {
				return this.showOkDialog(
					e.statusMessage,
					e.message
				)
			} catch (errorDuringHandling) {
				console.log('Original error', e)
				console.log('During handling', errorDuringHandling)
			}
		},
		showRaisedError (message) {
			return this.showError(new ErrorHandler(new Error(), message))
		}
	}
}
