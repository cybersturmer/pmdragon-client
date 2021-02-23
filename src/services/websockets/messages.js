import { removeElement, updateElementById } from 'src/services/util'
import $store from 'src/store'

export class MessageWebsocketHandler {
  constructor (messages, event) {
    this.messages = messages
    this.person = $store.getters['auth/MY_PERSON_ID']

    const data = JSON.parse(event.data)
    const payload = data.payload

    if ('created' in payload.message && payload.message.created_by === this.person) return false

    this.processEvent(payload)
  }

  async onCreate (message) {
    this.messages.push(message)
  }

  onUpdate (message) {
    updateElementById(this.messages, message)
  }

  onDelete (message) {
    removeElement(this.messages, message)
  }

  async processEvent (payload) {
    switch (payload.action) {
      case 'create':
        await this.onCreate(payload.message)
        break
      case 'update':
        this.onUpdate(payload.message)
        break
      case 'delete':
        this.onDelete(payload.message)
        break
      default:
        console.info(`Unhandled websocket action: ${payload.action}`)
    }
  }
}
