import $store from 'src/store'

export class StreamBase {
  constructor () {
    this.person = $store.getters['auth/MY_PERSON_ID']
  }

  isMyEvent (action, message) {
    switch (action) {
      case 'create':
        return ('created_by' in message) && (message.created_by === this.person)
      case 'update':
      case 'delete':
        return ('updated_by' in message) && (message.updated_by === this.person)
    }
  }

  processPayload (payload) {
    const message = payload.message
    const action = payload.action

    if (this.isMyEvent(action, message)) return false

    switch (action) {
      case 'create':
        this.onCreate(message)
        break
      case 'update':
        this.onUpdate(message)
        break
      case 'delete':
        this.onDelete(message)
        break
      default:
        throw new Error(`Unhandled action: ${action}`)
    }
  }

  onCreate (message) {}
  onUpdate (message) {}
  onDelete (message) {}
}
