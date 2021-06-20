import { DATETIME_MASK } from 'src/services/masks'
import { ErrorHandler, unWatch } from 'src/services/util'
import { date } from 'quasar'
import { Api } from 'src/services/api'
import IssueMorePopupMenu from 'components/popups/IssueMorePopupMenu'
import { Dialogs } from 'pages/mixins/dialogs'
import { Notifications } from 'pages/mixins/notifications'

export const editIssueMixin = {
	components: { IssueMorePopupMenu },
	mixins: [Dialogs, Notifications],
	props: {
		id: {
			required: true
		}
	},
	data () {
		return {
			tab: 'messages',
			isDescriptionEditing: false,
			editingMessageId: null,
			formData: {
				issue: {
					title: '',
					project_number: '',
					description: '',
					attachments: []
				}
			},
			formNewMessage: {
				issue: this.id,
				description: ''
			},
			mask: DATETIME_MASK
		}
	},
	watch: {
		messages (newArray, oldArray) {
			this._scrollToEnd()
		}
	},
	async mounted () {
		this.formData.issue = unWatch(this.$store.getters['core/ISSUE_BY_ID'](parseInt(this.id)))
		await this.$store.dispatch('connection/UPDATE_REQUEST_ID')

		const currentIssue = this.$store.getters['current/ISSUE']

		/** Let's unsubscribe from previously opened issue if that exist **/
		if (currentIssue) {
			const payload = {
				action: 'unsubscribe_from_messages_in_issue',
				request_id: this.$store.getters['connection/SOCKET_REQUEST_ID'],
				issue_pk: currentIssue
			}

			this.$socket.sendObj({ stream: 'issue_chat', payload: payload })
		}

		try {
			await this.$store.dispatch('current/SET_ISSUE', this.id)
			await this.getMessages()
			await this.getHistory()
		} catch (e) {
			this.showError(new ErrorHandler(e))
		}

		const payload = {
			action: 'subscribe_to_messages_in_issue',
			request_id: this.$store.getters['connection/SOCKET_REQUEST_ID'],
			issue_pk: this.id
		}

		this.$socket.sendObj({ stream: 'issue_chat', payload: payload })
	},
	methods: {
		_scrollToEnd () {
			const areaRefs = 'scrollArea'
			if (!(areaRefs in this.$refs)) return false

			this.$refs[areaRefs].setScrollPercentage(1.25, 300)
		},
		cancelEditingMessage () {
			this.editingMessageId = null
		},
		async removeMessage (id, chat) {
			chat.reset()

			await new Api({
				auth: true,
				expectedStatus: 204
			})
				.delete(
					`/core/issue-messages/${id}/`
				)

			const messagesClone = this.messages.filter((value) => {
				return value.id !== id
			})

			this.$store.commit('current/SET_ISSUE_MESSAGES', messagesClone)
		},
		editMessage (id, chat) {
			chat.reset()

			this.editingMessageId = id
			this.$refs.issueMessageSection.unlock()
			this.$nextTick(this.$refs.issueMessageSection.focus)
		},
		isTimelineShowValues (entry) {
			if (entry.edited_field === 'Ordering') {
				return false
			}

			return entry.before_value || entry.after_value
		},
		buildTimeLineEntryTitle (entry) {
			/** Here we can make a title for issue event **/
			const participantTitle = this.getParticipantTitleById(entry.changed_by)

			let action = ''
			switch (entry.edited_field) {
			case 'Ordering':
				action = parseInt(entry.before_value) > parseInt(entry.after_value)
					? 'increased'
					: 'decreased'
				action += ' priority'
				break
			default:
				action = `updated ${entry.edited_field}`
			}

			switch (entry.entry_type) {
			case 'mdi-playlist-edit':
				return `${participantTitle} ${action}`
			case 'mdi-playlist-plus':
				return `${participantTitle} created this Issue`
			default:
				return `${participantTitle} did (${entry.entry_type})`
			}
		},
		getRelativeDatetime (datetime) {
			/** Get relative datetime for messages (example: "an hour ago") **/
			return this.$moment(datetime).fromNow()
		},
		isItMe (id) {
			/** Return true if given id is current user id **/
			return id === this.$store.getters['auth/MY_PERSON_ID']
		},
		getParticipantTitleById (id) {
			/** return title with username, first name and last name as a String **/
			const participant = this.$store.getters['auth/PERSON_BY_ID'](id)
			if (!participant.id) return ''

			const username = `@${participant.username}`
			const name = `(${participant.first_name} ${participant.last_name})`

			return this.$q.screen.gt.sm ? `${username} ${name}` : username
		},
		getParticipantAvatarById (id) {
		  /** return avatar path by given user id **/
		  const participant = this.$store.getters['auth/PERSON_BY_ID'](id)
			if (!participant.id) return false

			return participant.avatar
		},
		async getMessages () {
			/** get messages for current issue without paging
       * Now its not a problem, will think later **/
			const response = await new Api({
				auth: true,
				expectedStatus: 200
			})
				.get(
					`/core/issue-messages/?issue=${this.formData.issue.id}`
				)

			await this.$store.dispatch('current/SET_ISSUE_MESSAGES', response.data)
		},
		async getHistory () {
			/** get history of changes for current issue **/
			const response = await new Api({
				auth: true,
				expectedStatus: 200
			})
				.get(
					`/core/issues-history/?issue=${this.formData.issue.id}`
				)

			await this.$store.dispatch('current/SET_ISSUE_HISTORY', response.data)
		}
	},
	computed: {
		messages () {
			return this.$store.getters['current/ISSUE_MESSAGES']
		},
		history () {
			return this.$store.getters['current/ISSUE_HISTORY']
		},
		timelineLayout () {
			return this.$q.screen.lt.sm ? 'dense' : (this.$q.screen.lt.md ? 'comfortable' : 'loose')
		},
		estimations () {
		  // Check usage
			return this.$store.getters['core/ISSUE_ESTIMATIONS_BY_CURRENT_PROJECT']
		},
		states () {
		  // Check usage
			return this.$store.getters['core/ISSUE_STATES_BY_CURRENT_PROJECT']
		},
		types () {
			// Check usage
			return this.$store.getters['core/ISSUE_TYPES_BY_CURRENT_PROJECT']
		},
		participants () {
		  // Check usage
			return this.$store.getters['auth/PARTICIPANTS_BY_CURRENT_PROJECT']
		},
		estimation () {
			return this.$store.getters['core/ISSUE_ESTIMATION_BY_ID'](this.formData.issue.estimation_category)
		},
		estimationTitle () {
			try {
				return this.$store.getters['core/ISSUE_ESTIMATION_BY_ID'](this.formData.issue.estimation_category).title
			} catch (e) {
				return 'None'
			}
		},
		createdAt () {
		  // check usage
			return date.formatDate(this.formData.issue.created_at, DATETIME_MASK)
		},
		updatedAt () {
			// check usage
			return date.formatDate(this.formData.issue.updated_at, DATETIME_MASK)
		},
		thereAreMessages () {
			return this.$store.getters['current/ARE_ISSUE_MESSAGES']
		},
		isIssueTypeIcon () {
			// CHeck usages
			return this.$store.getters['core/IS_ISSUE_TYPE_HAVE_ICON'](this.formData.issue.type_category)
		},
		getIssueTypeIcon () {
		  // CHeck usages
			return this.$store.getters['core/ISSUE_TYPE_ICON_BY_ISSUE_TYPE_CATEGORY_ID'](this.formData.issue.type_category)
		},
		getIssueTypeIconColor () {
		  // Check usages
			try {
				return this.getIssueTypeIcon.color
			} catch (e) {
				return ''
			}
		},
		getIssueTypeIconPrefix () {
		  // Check usages
			try {
				return this.getIssueTypeIcon.prefix
			} catch (e) {
				return ''
			}
		},
		mentioningRegex () {
			return this.$store.getters['auth/MENTIONING_REGEX']
		}
	}
}
