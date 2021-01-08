export const Dialogs = {
  methods: {
    showOkDialog (title, message, unsafe = false) {
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
    showOkCancelDialog (title, message, actionOk = 'OK', unsafe = false) {
      return this.$q.dialog({
        dark: true,
        title: title,
        message: message,
        html: unsafe,
        ok: {
          label: actionOk,
          color: 'amber',
          outline: true
        },
        cancel: {
          label: 'Cancel',
          color: 'amber',
          flat: true
        }
      })
    },
    showError (e) {
      if (!e.messageUseful) return false

      return this.showOkDialog(
        e.statusMessage,
        e.message
      )
    }
  }
}
