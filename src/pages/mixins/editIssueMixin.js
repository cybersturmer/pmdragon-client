import { DATETIME_MASK } from 'src/services/masks'
import { ErrorHandler, unWatch } from 'src/services/util'
import { date } from 'quasar'
import { Api } from 'src/services/api'
import IssueMorePopupMenu from 'components/popups/IssueMorePopupMenu'
import { Dialogs } from 'pages/mixins/dialogs'
import { Notifications } from 'pages/mixins/notifications'

export const editIssueMixin = {
	components: { IssueMorePopupMenu },
	mixins: [
		Dialogs,
		Notifications
	],
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
		},
		issue (newObject, oldObject) {
			this.formData.issue = unWatch(newObject)
		}
	},
	async beforeMount () {
		/** Let's set issue Id first **/
		await this.$store.dispatch('current/SET_ISSUE_ID', this.id)
	},
	async mounted () {
		/** Let's take a local copy of vuex issue object **/
		this.formData.issue = unWatch(this.$store.getters['current/ISSUE'])

		/** Now we can increment request id, we need it for socket connection **/
		// @todo do we really need it?
		await this.$store.dispatch('connection/UPDATE_REQUEST_ID')

		const currentIssue = this.$store.getters['current/ISSUE_ID']

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
			await this.getMessages()
			await this.getHistory()
		} catch (e) {
			this.showError(new ErrorHandler(e))
		}

		const payload = {
			action: 'subscribe_to_messages_in_issue',
			request_id: this.$store.getters['connection/SOCKET_REQUEST_ID'],
			issue_pk: currentIssue
		}

		this.$socket.sendObj({ stream: 'issue_chat', payload: payload })
	},
	methods: {
		async refresh (done) {
			try {
				await this.$store.dispatch('core/INIT_ISSUES')

				this.formData.issue = unWatch(this.$store.getters['core/ISSUE_BY_ID'](parseInt(this.id)))

				await this.getMessages()
				await this.getHistory()
			} catch (e) {
				this.showError(new ErrorHandler(e))
			} finally {
				if (done) {
					done()
				}
			}
		},
		_scrollToEnd () {
			const areaRefs = 'scrollArea'
			if (!(areaRefs in this.$refs)) return false

			this.$refs[areaRefs].setScrollPercentage(1.25, 300)
		},
		cancelEditingMessage () {
			this.editingMessageId = null
		},
		async removeMessage (id) {
			const payload = {
				id
			}

			await this.$store.dispatch('current/REMOVE_MESSAGE_BY_ID', payload)
		},
		editMessage (id) {
			this.editingMessageId = id
			this.$refs.issueMessageSection.unlock()
			this.$nextTick(this.$refs.issueMessageSection.focus)
		},
		getRelativeDatetime (datetime) {
			/** Get relative datetime for messages (example: "an hour ago") **/
			return this.$moment(datetime).fromNow()
		},
		isItMe (id) {
			/** Return true if given id is current user id **/
			return this.$store.getters['auth/IS_ME_BY_ID'](id)
		},
		getParticipantTitleById (id) {
			/** return title with username, first name and last name as a String **/
			try {
				return this.$q.screen.gt.sm ? this.$store.getters['auth/PERSON_FULL_REPRESENTATION_BY_ID'](id)
					: this.$store.getters['auth/PERSON_USERNAME_BY_ID'](id)
			} catch (e) {
				return ''
			}
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
		issue () {
			return this.$store.getters['current/ISSUE']
		},
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
