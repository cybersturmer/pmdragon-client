import $store from 'src/store'

export class IssueInWorkspace {
  constructor () {
    this.person = $store.getters['auth/MY_PERSON_ID']
  }

  processPayload (payload) {
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
    $store.commit('core/ADD_ISSUE_TO_ISSUES', message)
  }

  onUpdate (message) {
    $store.commit('core/UPDATE_ISSUE', message)
  }

  onDelete (message) {
    $store.commit('core/DELETE_ISSUE', message)
  }
}
