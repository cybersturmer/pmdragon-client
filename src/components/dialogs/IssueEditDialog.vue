<template>
  <q-dialog
    ref="dialog"
    @hide="onDialogHide"
    :maximized="$q.screen.lt.md">
			<q-card
				flat
				bordered
				class="q-dialog-plugin no-scroll"
				:style="mainCardStyles">
				<q-card-section :horizontal="$q.screen.gt.md" class="q-px-xs q-py-xs">
							<!-- We show this block only on small screen size (copyLink, more, close) -->
							<q-card-section v-if="$q.screen.lt.lg" class="column items-end q-pb-none q-pt-xs">
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
									visible
									ref="scrollArea"
									class="q-pr-xs"
									:style="`${middleSectionHeight}`">
									<q-card-section v-if="$q.screen.lt.lg" class="q-pa-none">
										<IssueManageSection :issue="formData.issue"/>
									</q-card-section>
									<IssueUploaderSection :issue="formData.issue" />
									<IssueDescriptionSection :issue="formData.issue"
																					 @update:modelValue="formData.issue.description = $event"
																					 @updateDescription="updateIssueDescription($event)"/>
									<q-separator class="q-mt-md q-mx-md"/>
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
																<div v-for="packedMessage in messages"
																		 :key="packedMessage.id"
																		 class="full-width">
																	<q-chat-message v-if="packedMessage.label" :label="packedMessage.label"/>
																	<IssueChatMobileMessage :message-pack="packedMessage"
																													 @edit="editMessage"
																													 @remove="removeMessageEvent"/>
																</div>
															</q-card-section>
															<q-card-section v-else>
																<div v-for="packedMessage in messages"
																		 :key="packedMessage.id"
																		 class="full-width">
																	<q-chat-message v-if="packedMessage.label" :label="packedMessage.label"/>
																	<IssueChatDesktopMessage :message-pack="packedMessage"
																													 @edit="editMessage"
																													 @remove="removeMessageEvent"/>
																</div>
															</q-card-section>
														</q-card-section>
													</q-card>
												</q-tab-panel>
												<q-tab-panel
													name="history"
													class="no-padding no-scroll">
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
								<q-separator class="q-mx-md"/>
								<q-card-section class="q-pa-none" style="height: 165px">
									<IssueMessageSection ref="issueMessageSection"
																			 :issueId="formNewMessage.issue"
																			 :messageId="editingMessageId"
																			 @cancelEditingMessage="cancelEditingMessage"/>
								</q-card-section>
							</q-card-section>
							<!-- Right section on desktop manage section / created or updated section -->
							<q-card-section
								v-if="$q.screen.gt.md"
								class="col-md-4">
								<!-- Right section, we can change issue data here -->
								<q-card-section v-if="$q.screen.gt.sm" class="column items-end">
									<IssueHeader :issue="formData.issue"
															 class="col"
															 @hide="hide"
															 @refresh="refresh"/>
								</q-card-section>
								<IssueManageSection :issue="formData.issue"/>
								<IssueCreateUpdateSection :issue="formData.issue"/>
							</q-card-section>
					</q-card-section>
			</q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from 'vue'
import { date } from 'quasar'
import { Dialogs } from 'src/pages/mixins/dialogs'
import { DATETIME_MASK } from 'src/services/masks'
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
import { CurrentActionsMixin } from 'src/services/actions/current'
import { CoreActionsMixin } from 'src/services/actions/core'
import { websocket } from 'pages/mixins/websockets'

export default defineComponent({
	name: 'IssueEditDialog',
	emits: [
		'ok',
		'hide'
	],
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
		Notifications,
		CurrentActionsMixin,
		CoreActionsMixin,
		websocket
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
			mainCardStyles: this.$q.screen.gt.sm ? 'width: 98vw; height: 98vh; max-width: 98vw' : '',
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
			issueMessageBlockHeight: '165px', // 36px title + 48px header
			middleSectionBorder: 'border-bottom: 1px solid #686868;',
			middleSectionHeight: 'height: calc(100vh - 305px);'
		}
	},
	watch: {
		messages (newArray, oldArray) {
			this._scrollToEnd()
		},
		issue (newObject, oldObject) {
			if (newObject) {
				this.formData.issue = unWatch(newObject)
			}
		}
	},
	beforeMount () {
		this.$store.dispatch('current/SET_ISSUE_ID', this.id)
	},
	async mounted () {
		/** We need it for not mutate outside of mutations context **/
		this.formData.issue = unWatch(this.$store.getters['current/ISSUE'])

		/** Let's wait till the sockets are opened and then
		 * unsubscribe from previously opened issue messages
		 * and subscribe t currently opened issue */
		await this.subscribeIssueChat()

		try {
			await Promise.all([
				this.getMessagesEvent(),
				this.getHistoryEvent()
			])
		} catch (e) {
			this.showError(new ErrorHandler(e))
		}
	},
	async beforeUnmount () {
		await this.unsubscribeIssueChat()
	},
	computed: {
		isMobileApplication () {
			return this.$q.platform.is.cordova
		},
		issue () {
			return this.$store.getters['current/ISSUE']
		},
		messages () {
			/** Result example:
			 * {
			 *		"label": "July 22",
			 *		"key": 92,
			 *		"createdBy": {
			 *			"id": 1,
			 *			"username": "cyber",
			 *			"email": "cybersturmer@ya.ru",
			 *			"avatar": "/media/person_2/images/avatar_5c36e6a2409348969392320bec95a1d8.jpg",
			 *			"first_name": "Vladimir",
			 *			"last_name": "Shturmer",
			 *			"title": "Vladimir Shturmer",
			 *			"is_active": true,
			 *			"last_login": "2021-09-01T13:21:04.630339Z",
			 *			"created_at": "2021-06-05T23:32:07.832727Z"
			 *		},
			 *		"sent": false,
			 *		"text": [
			 *			"One more message here",
			 *			"What are you doing?"
			 *		],
			 *		"date": "2021-07-22T22:06:40.496975Z",
			 *		"list": [
			 *			{
			 *				"id": 92,
			 *				"issue": 2,
			 *				"description": "One more message here",
			 *				"created_by": 1,
			 *				"created_at": "2021-07-22T22:06:40.496975Z",
			 *				"updated_at": "2021-07-22T22:06:40.496995Z"
			 *			},
			 *			{
			 *				"id": 93,
			 *				"issue": 2,
			 *				"description": "What are you doing?",
			 *				"created_by": 1,
			 *				"created_at": "2021-07-22T22:13:14.622125Z",
			 *				"updated_at": "2021-07-22T22:13:14.622145Z"
			 *			}
			 *		]
			 *	 },
			 *
			 * **/
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
		}
	},
	methods: {
		async refresh (done) {
			try {
				await this.getIssues()
				this.formData.issue = unWatch(this.$store.getters['core/ISSUE_BY_ID'](parseInt(this.id)))

				await this.getMessagesEvent()
				await this.getHistoryEvent()
			} catch (e) {
				this.showError(new ErrorHandler(e))
			} finally {
				if (done) {
					done()
				}
			}
		},
		async updateIssueDescription (value) {
			/** update Issue description
			 * we use it as a handler for description field changing **/
			const payload = {
				id: this.formData.issue.id,
				description: this.formData.issue.description
			}

			await this.patchIssue(payload)
			this.formData.issue.description = value
		},
		_scrollToEnd () {
			const areaRefs = 'scrollArea'
			if (!(areaRefs in this.$refs)) return false

			this.$refs.scrollArea.setScrollPercentage('vertical', 300)
		},
		cancelEditingMessage () {
			this.editingMessageId = null
		},
		async removeMessageEvent (id) {
			const payload = {
				id
			}

			await this.removeMessage(payload)
			await this.$store.dispatch('current/REMOVE_ISSUE_MESSAGE', { id })
			this.editingMessageId = null
		},
		editMessage (id) {
			this.editingMessageId = id
			this.$nextTick(this.$refs.issueMessageSection.focus)
		},
		getParticipantTitleById (id) {
			/** return title with username, first name and last name as a String **/
			try {
				return this.$q.screen.gt.sm
					? this.$store.getters['auth/PERSON_FULL_REPRESENTATION_BY_ID'](id)
					: this.$store.getters['auth/PERSON_USERNAME_BY_ID'](id)
			} catch (e) {
				return ''
			}
		},
		async getMessagesEvent () {
			/** get messages for current issue without paging
			 * Now its not a problem, will think later **/
			const payload = {
				id: this.formData.issue.id
			}

			try {
				await this.getMessagesPacked(payload)
			} catch (e) {
				this.showError(e)
			}
		},
		async getHistoryEvent () {
			/** get history of changes for current issue **/
			const payload = {
				id: this.formData.issue.id
			}

			try {
				await this.getHistory(payload)
			} catch (e) {
				this.showError(e)
			}
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
})
</script>
<style lang="scss">
	.q-message-label {
		font-weight: bold;
		background-color: rgba(76, 76, 76, 0.4);
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
