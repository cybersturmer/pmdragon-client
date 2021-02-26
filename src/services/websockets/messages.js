import { removeElement, updateElementById } from 'src/services/util'
import $store from 'src/store'

export class MessageWebsocketHandler {
  constructor (messages, event) {
    this.messages = messages
    this.person = $store.getters['auth/MY_PERSON_ID']

    const data = JSON.parse(event.data)
    this.payload = data.payload
  }

  onCreate (message) {
    this.messages.push(message)
  }

  onUpdate (message) {
    updateElementById(this.messages, message)
  }

  onDelete (message) {
    removeElement(this.messages, message)
  }

  processEvent () {
    if ('created_by' in this.payload.message && this.payload.message.created_by === this.person) return false
    switch (this.payload.action) {
      case 'create':
        this.onCreate(this.payload.message)
        break
      case 'update':
        this.onUpdate(this.payload.message)
        break
      case 'delete':
        this.onDelete(this.payload.message)
        break
      default:
        console.info(`Unhandled websocket action: ${this.payload.action}`)
    }
  }
}
