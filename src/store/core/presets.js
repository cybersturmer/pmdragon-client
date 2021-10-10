import { LocalStorage } from 'quasar'

export const empty = () => {
	return {
		enabled: false,
		backlogs: [],
		sprints: [],
		issues: [],
		issue_attachments: [],
		issue_types: [],
		issue_type_icons: [],
		issue_states: [],
		issue_estimations: [],
		sprint_durations: [],
		working_days: []
	}
}

export const restored = () => {
	return {
		enabled: LocalStorage.getItem('core.enabled'),
		backlogs: LocalStorage.getItem('core.backlogs'),
		sprints: LocalStorage.getItem('core.sprints'),
		issues: LocalStorage.getItem('core.issues'),
		issue_attachments: LocalStorage.getItem('core.issue_attachments'),
		issue_types: LocalStorage.getItem('core.issue_types'),
		issue_type_icons: LocalStorage.getItem('core.issue_type_icons'),
		issue_states: LocalStorage.getItem('core.issue_states'),
		issue_estimations: LocalStorage.getItem('core.issue_estimations'),
		sprint_durations: LocalStorage.getItem('core.sprint_durations'),
		working_days: LocalStorage.getItem('core.working_days')
	}
}
