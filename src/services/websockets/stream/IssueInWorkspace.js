import $store from 'src/store'
import { StreamBase } from 'src/services/websockets/stream/base/StreamBase'

export class IssueInWorkspace extends StreamBase {
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
