import { LocalStorage } from 'quasar'

export default function () {
	return {
		backlogs: LocalStorage.getItem('core.backlogs') || [],
		sprints: LocalStorage.getItem('core.sprints') || [],
		issues: LocalStorage.getItem('core.issues') || [],
		issue_attachments: LocalStorage.getItem('core.issue_attachments') || [],
		issue_types: LocalStorage.getItem('core.issue_types') || [],
		issue_type_icons: LocalStorage.getItem('core.issue_type_icons') || [],
		issue_states: LocalStorage.getItem('core.issue_states') || [],
		issue_estimations: LocalStorage.getItem('core.issue_estimations') || [],
		sprint_durations: LocalStorage.getItem('core.sprint_duration') || []
	}
}
