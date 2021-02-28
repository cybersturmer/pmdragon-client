import $store from 'src/store'

export class IssueChat {
  constructor () {
    this.person = $store.getters['auth/MY_PERSON_ID']
  }

  isMyEvent (payload) {
    return ('created_by' in payload.message) && (payload.message.created_by === this.person)
  }

  processPayload (payload) {
    if (this.isMyEvent(payload)) return false

    switch (payload.action) {
      case 'create':
        this.onCreate(payload.message)
        break
      case 'update':
        this.onUpdate(payload.message)
        break
      case 'delete':
        this.onDelete(payload.message)
        break
      default:
        console.info(`Unhandled websocket action: ${this.payload.action}`)
    }
  }

  onCreate (message) {
    $store.commit('current/ADD_ISSUE_MESSAGE', message)
  }

  onUpdate (message) {
    $store.commit('current/UPDATE_ISSUE_MESSAGE', message)
  }

  onDelete (message) {
    $store.commit('current/DELETE_ISSUE_MESSAGE', message)
  }
}
