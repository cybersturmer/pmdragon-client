import { LocalStorage } from 'quasar'

export default function () {
  return {
    workspace: LocalStorage.getItem('current.workspace') || null,
    project: LocalStorage.getItem('current.project') || null,
    loading: false, // We don't need to store it in LocalStorage
    loading_module: null, // We don't need to store it in LocalStorage
    issue: LocalStorage.getItem('current.issue') || null,
    issue_messages: LocalStorage.getItem('current.issue_messages') || null,
    issue_history: LocalStorage.getItem('current.issue_history') || null,
    issue_in_workspace_subscribed: false // We need it to understand that we subscribed on issues in Workspace
  }
}
