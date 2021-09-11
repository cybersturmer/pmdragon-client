export class StreamBase {
	constructor (proxy, options) {
		this.$store = proxy.$store
		this.myPersonId = proxy.$store.getters['auth/MY_PERSON_ID']
		this.options = options
	}

	isMyEvent (action, message) {
		switch (action) {
		case 'create':
			return ('created_by' in message) && (message.created_by === this.myPersonId)
		case 'update':
		case 'delete':
			return ('updated_by' in message) && (message.updated_by === this.myPersonId)
		}
	}

	processPayload (payload) {
		const message = payload.message
		const action = payload.action

		if (this.isMyEvent(action, message)) return false

		switch (action) {
		case 'create':
			this.onCreate(message)
			return 'created'
		case 'update':
			this.onUpdate(message)
			return 'updated'
		case 'delete':
			this.onDelete(message)
			return 'deleted'
		default:
			throw new Error(`Unhandled action: ${action}`)
		}
	}

	onCreate (message) {}
	onUpdate (message) {}
	onDelete (message) {}
}
