import { LocalStorage, Dark } from 'quasar'

export const empty = () => {
	return {
		enabled: false,
		log: [],
		workspace: null,
		project: null,
		loading: false,
		loading_module: null,
		dark: Dark.isActive,
		issue_id: null,
		issue_messages: null,
		issue_history: null,
		issue_in_workspace_subscribed: false
	}
}

export const restored = () => {
	return {
		enabled: LocalStorage.getItem('current.enabled'),
		log: [],
		workspace: LocalStorage.getItem('current.workspace'),
		project: LocalStorage.getItem('current.project'),
		loading: false, // We don't need to store it in LocalStorage
		loading_module: null, // We don't need to store it in LocalStorage
		dark: LocalStorage.getItem('current.dark') || empty().dark,
		issue_id: LocalStorage.getItem('current.issue_id'),
		issue_messages: LocalStorage.getItem('current.issue_messages'),
		issue_history: LocalStorage.getItem('current.issue_history'),
		issue_in_workspace_subscribed: false // We need it to understand that we subscribed on issues in Workspace
	}
}
