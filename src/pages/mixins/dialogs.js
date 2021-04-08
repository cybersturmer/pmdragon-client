import { ErrorHandler } from 'src/services/util'

export const Dialogs = {
	methods: {

		showOkDialog (
			title,
			message,
			unsafe = false
		) {
			return this.$q.dialog({
				dark: true,
				html: unsafe,
				title: title,
				message: message,
				ok: {
					label: 'OK',
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
				normal: 'amber',
				danger: 'red-14'
			}

			return this.$q.dialog({
				dark: true,
				title: title,
				message: message,
				html: unsafe,
				ok: {
					label: actionOk,
					color: colorOptions[actionColor]
				},
				cancel: true,
				persistent: true
			})
		},
		showError (e) {
			if (!e.messageUseful) {
				return false
			}

			return this.showOkDialog(
				e.statusMessage,
				e.message
			)
		},
		showRaisedError (message) {
			this.showError(new ErrorHandler(new Error(), message))
		}
	}
}
