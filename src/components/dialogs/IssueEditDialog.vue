<template>
  <q-dialog
    ref="dialog"
    @hide="onDialogHide"
    :maximized="$q.screen.lt.md">
			<q-card
				flat
				bordered
				class="q-dialog-plugin"
				:style="mainCardStyles">
				<q-card-section :horizontal="$q.screen.gt.md" class="q-px-xs q-py-xs">
							<!-- We show this block only on small screen size (copyLink, more, close) -->
							<q-card-section v-if="$q.screen.lt.lg" class="column items-end q-pb-none q-pt-sm">
								<IssueHeader :issue="formData.issue"
														 class="col"
														 @hide="hide"
														 @refresh="refresh"/>
							</q-card-section>
							<!-- Title block -->
							<IssueTitleSection v-if="$q.screen.lt.lg"
																 :issue="formData.issue"/>
							<q-card-section class="col-md-8 col-xs-12 col-sm-12 q-pa-xs overflow-hidden">
								<IssueTitleSection v-if="$q.screen.gt.md"
																	 :issue="formData.issue"/>
								<q-scroll-area
									ref="scrollArea"
									class="q-pr-xs"
									:style="`${middleSectionHeight} ${middleSectionBorder}`">
									<q-card-section v-if="$q.screen.lt.lg" class="q-pa-none">
										<IssueManageSection :issue="formData.issue"/>
									</q-card-section>
									<IssueUploaderSection :issue="formData.issue" />
									<IssueDescriptionSection :issue="formData.issue" />
									<q-separator class="q-mt-md"/>
									<!-- Messages section -->
									<q-card-section class="q-pa-none">
										<!-- Block with messages -->
										<q-card-section class="q-py-sm">
											<q-tabs
												v-model="tab"
												dense
												narrow-indicator>
												<q-tab name="messages" label="Messages" icon="mdi-android-messages"/>
												<q-tab name="history" label="History" icon="mdi-history"/>
											</q-tabs>
											<q-tab-panels
												v-model="tab"
												animated
												transition-next="fade"
												transition-prev="fade">
												<q-tab-panel
													class="no-padding"
													name="messages">
													<q-card
														flat
														bordered
														:class="`${ $q.dark.isActive ? 'bg-darkest' : 'bg-accent' }`">
														<!-- Wrapper for messages to show / hide block if there are no messages -->
														<q-card-section v-if="thereAreMessages">
															<q-card-section v-if="isMobileApplication">
																<div v-for="packedMessage in packedMessages"
																		 :key="packedMessage.id"
																		 class="full-width">
																	<q-chat-message v-if="packedMessage.label" :label="packedMessage.label"/>
																	<IssueChatMobileMessage :message-pack="packedMessage"
																													 @edit="editMessage"
																													 @remove="removeMessage"/>
																</div>
															</q-card-section>
															<q-card-section v-else>
																<div v-for="packedMessage in packedMessages"
																		 :key="packedMessage.id"
																		 class="full-width">
																	<q-chat-message v-if="packedMessage.label" :label="packedMessage.label"/>
																	<IssueChatDesktopMessage :message-pack="packedMessage"
																													 @edit="editMessage"
																													 @remove="removeMessage"/>
																</div>
															</q-card-section>
														</q-card-section>
													</q-card>
												</q-tab-panel>
												<q-tab-panel
													name="history"
													class="no-padding">
													<q-card
														flat
														bordered
														:class="`${ $q.dark.isActive ? 'bg-dark' : 'bg-accent' }`">
														<IssueTimeLineSection :history="history"/>
													</q-card>
												</q-tab-panel>
											</q-tab-panels>
										</q-card-section>
									</q-card-section>
								</q-scroll-area>
									<!-- New Message Block -->
								<q-card-section class="q-pa-none">
									<IssueMessageSection ref="issueMessageSection"
																			 :issue-id="formNewMessage.issue"
																			 :editing-message-id="editingMessageId"
																			 @cancelEditingMessage="cancelEditingMessage"/>
								</q-card-section>
							</q-card-section>
							<!-- Right section on desktop manage section / created or updated section -->
							<q-card-section
								v-if="$q.screen.gt.md"
								class="col-md-4">
							<!-- Right section, we can change issue data here -->
								<q-card-section v-if="$q.screen.gt.sm" class="column items-end">
									<IssueHeader :issue="formData.issue" class="col" @hide="hide"/>
								</q-card-section>
								<IssueManageSection :issue="formData.issue"/>
								<IssueCreateUpdateSection :issue="formData.issue"/>
							</q-card-section>
					</q-card-section>
			</q-card>
  </q-dialog>
</template>

<script>
import { date } from 'quasar'
import { Api } from 'src/services/api'
import { Dialogs } from 'src/pages/mixins/dialogs'
import { DATETIME_MASK } from 'src/services/masks'
import { packMessages } from 'src/services/messages'
import { ErrorHandler, unWatch } from 'src/services/util'
import { Notifications } from 'src/pages/mixins/notifications'

import IssueHeader from 'src/components/elements/issue_dialog/IssueHeader'
import IssueTitleSection from 'src/components/elements/issue_dialog/IssueTitleSection'
import IssueManageSection from 'src/components/elements/issue_dialog/IssueManageSection'
import IssueMessageSection from 'src/components/elements/issue_dialog/IssueMessageSection'
import IssueTimeLineSection from 'src/components/elements/issue_dialog/IssueTimeLineSection'
import IssueUploaderSection from 'src/components/elements/issue_dialog/IssueUploaderSection'
import IssueChatMobileMessage from 'src/components/elements/issue_dialog/IssueChatMobileMessage'
import IssueChatDesktopMessage from 'src/components/elements/issue_dialog/IssueChatDesktopMessage'
import IssueDescriptionSection from 'src/components/elements/issue_dialog/IssueDescriptionSection'
import IssueCreateUpdateSection from 'src/components/elements/issue_dialog/IssueCreateUpdateSection'

export default {
	name: 'IssueEditDialog',
	components: {
		IssueChatDesktopMessage,
		IssueTimeLineSection,
		IssueChatMobileMessage,
		IssueDescriptionSection,
		IssueMessageSection,
	  IssueUploaderSection,
		IssueTitleSection,
		IssueHeader,
		IssueCreateUpdateSection,
		IssueManageSection
	},
	mixins: [
		Dialogs,
		Notifications
	],
	props: {
		id: {
			required: true,
			type: Number
		}
	},
	data () {
		return {
			tab: 'messages',
			splitterModel: 80,
			mainCardStyles: this.$q.screen.gt.sm ? 'width: 95vw; height: 95vh; max-width: 95vw' : '',
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
			mask: DATETIME_MASK,
			packedMessages: [],
			middleSectionBorder: 'border-bottom: 1px solid #686868;',
			middleSectionHeight: 'height: calc(84vh - 11em);'
		}
	},
	watch: {
		messages (newArray, oldArray) {
			this._scrollToEnd()
			if (newArray) {
				this.packedMessages = packMessages(newArray, this.myId)
			}
		},
		issue (newObject, oldObject) {
			if (newObject) {
				this.formData.issue = unWatch(newObject)
			}
		}
	},
	async beforeMount () {
		await this.$store.dispatch('current/SET_ISSUE_ID', this.id)
	},
	async mounted () {
		/** We need it for not mutate outside of mutations context **/
		this.formData.issue = unWatch(this.$store.getters['current/ISSUE'])

		const currentIssue = this.$store.getters['current/ISSUE_ID']

		await this.$store.dispatch('connection/UPDATE_REQUEST_ID')
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
	computed: {
		isMobileApplication () {
			return this.$q.platform.is.cordova
		},
		myId () {
			return this.$store.getters['auth/MY_ID']
		},
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
			this.editingMessageId = null
		},
		editMessage (id) {
			this.editingMessageId = id
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
		},
		show () {
			this.$refs.dialog.show()
		},

		hide () {
			this.$store.dispatch('current/RESET_ISSUE_SELECTION')
			this.$refs.dialog.hide()
		},

		onDialogHide () {
			this.$emit('hide')
		},

		onOKClick () {
			const payload = {
			}

			this.$emit('ok', payload)
			this.hide()
		},

		onCancelClick () {
			this.hide()
		}
	}
}
</script>
<style lang="scss">
	.q-message-label {
		font-weight: bold;
		background-color: rgba(76, 76, 76, 0.4);
	}

  .editable_block:hover {
		background-color: var(--q-color-secondary)!important;
		color: var(--q-color-dark)!important;
  }

  .editor_token {
    display: inline-block;
    font-weight: 700;
    background-color: $info;
    border-radius: 5px;
    color: white;
    padding: 3px 6px;
    margin: 0;
  }

  .editor_token:before {
    content: '@'
  }

  .q-timeline__title {
    font-size: 0.9rem;
  }

  .q-timeline__content {
    padding-bottom: 5px;
  }

	.q-message-text {
		padding: 5px;
	}

	.q-item {
		min-height: auto;
	}
</style>
