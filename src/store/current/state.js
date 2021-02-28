import { LocalStorage } from 'quasar'

export default function () {
  return {
    workspace: LocalStorage.getItem('current.workspace') || null,
    project: LocalStorage.getItem('current.project') || null,
    issue: LocalStorage.getItem('current.issue') || null,
    issue_messages: LocalStorage.getItem('current.issue_messages') || null,
    issue_history: LocalStorage.getItem('current.issue_history') || null
  }
}
