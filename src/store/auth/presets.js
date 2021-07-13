import { LocalStorage } from 'quasar'

export const empty = () => {
	return {
		enabled: false,
		person_id: null,
		workspaces: [],
		persons: [],
		invited: [],
		tokens: {
			access: {
				data: null,
				expired_at: null
			},
			refresh: {
				data: null,
				expired_at: null
			}
		}
	}
}

export const restored = () => {
	return {
		enabled: LocalStorage.getItem('auth.enabled') || false,
		person_id: LocalStorage.getItem('auth.person_id'),
		workspaces: LocalStorage.getItem('auth.workspaces'),
		persons: LocalStorage.getItem('auth.persons'),
		invited: LocalStorage.getItem('auth.invited'),
		tokens: {
			access: LocalStorage.getItem('auth.tokens.access') || empty().tokens.access,
			refresh: LocalStorage.getItem('auth.tokens.refresh') || empty().tokens.refresh
		}
	}
}
