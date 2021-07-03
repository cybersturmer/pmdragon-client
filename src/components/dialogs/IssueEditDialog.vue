<template>
  <q-dialog
    ref="dialog"
    @hide="onDialogHide"
    :maximized="$q.screen.lt.md">
			<q-card
				dark
				flat
				bordered
				class="q-dialog-plugin bg-secondary"
				:style="mainCardStyles">
				<q-pull-to-refresh
					bg-color="secondary"
					color="amber"
					@refresh="refresh">
					<q-card-section :horizontal="$q.screen.gt.md" class="q-px-xs q-py-xs">
							<!-- We show this block only on small screen size (copyLink, more, close) -->
							<q-card-section v-if="$q.screen.lt.md" class="column items-end q-pb-none q-pt-sm">
								<IssueHeader :issue="formData.issue"
														 class="col"
														 @hide="hide"/>
							</q-card-section>
							<!-- Title block -->
							<IssueTitleSection v-if="$q.screen.lt.md"
																 :issue="formData.issue"/>
							<q-card-section class="col-md-8 col-xs-12 col-sm-12 q-pa-xs overflow-hidden">
								<IssueTitleSection v-if="$q.screen.gt.sm"
																	 :issue="formData.issue"/>
								<q-scroll-area
									dark
									ref="scrollArea"
									:style="`height: ${ $q.screen.gt.sm ? '65vh' : '68vh'}; border-bottom: 1px solid #686868;`">
									<q-card-section v-if="$q.screen.lt.md" class="q-pa-none">
										<IssueManageSection :issue="formData.issue"/>
									</q-card-section>
									<IssueUploaderSection :issue="formData.issue" />
									<IssueDescriptionSection :issue="formData.issue" />
									<!-- Messages section -->
									<q-card-section class="q-pa-none">
										<!-- Block with messages -->
										<q-card-section class="q-py-sm">
											<q-tabs
												v-model="tab"
												dense
												narrow-indicator>
												<q-tab name="messages" label="Messages" icon="mdi-android-messages" content-class="text-amber"/>
												<q-tab name="history" label="History" icon="mdi-history" content-class="text-amber"/>
											</q-tabs>
											<q-separator />
											<q-tab-panels
												v-model="tab"
												class="bg-primary"
												animated
												transition-next="fade"
												transition-prev="fade">
												<q-tab-panel
													dark
													class="no-padding"
													name="messages">
													<q-card
														dark
														flat
														bordered>
														<q-card-section v-if="isMobileApplication">
															<IssueChatMobileMessage v-for="message in messages"
																											:message="message"
																											:key="message.id"
																											@edit="editMessage"
																											@remove="removeMessage"/>
														</q-card-section>
														<q-card-section v-else>
															<IssueChatDesktopMessage v-for="message in messages"
																											 :message="message"
																											 :key="message.id"
																											 @edit="editMessage"
																											 @remove="removeMessage"/>
														</q-card-section>
													</q-card>
												</q-tab-panel>
												<q-tab-panel
													dark
													name="history"
													class="no-padding">
													<q-card
														dark
														flat
														bordered>
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
				</q-pull-to-refresh>
			</q-card>
  </q-dialog>
</template>

<script>
import { editIssueMixin } from 'pages/mixins/editIssueMixin'
import IssueManageSection from '../elements/issue_dialog/IssueManageSection'
import IssueCreateUpdateSection from '../elements/issue_dialog/IssueCreateUpdateSection'
import IssueHeader from '../elements/issue_dialog/IssueHeader'
import IssueTitleSection from '../elements/issue_dialog/IssueTitleSection'
import IssueUploaderSection from '../elements/issue_dialog/IssueUploaderSection'
import IssueDescriptionSection from '../elements/issue_dialog/IssueDescriptionSection'
import IssueMessageSection from '../elements/issue_dialog/IssueMessageSection'
import IssueChatMobileMessage from '../elements/issue_dialog/IssueChatMobileMessage'
import IssueTimeLineSection from '../elements/issue_dialog/IssueTimeLineSection'
import IssueChatDesktopMessage from '../elements/issue_dialog/IssueChatDesktopMessage'

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
	  editIssueMixin
	],
	data () {
		return {
			mainCardStyles: this.$q.screen.gt.sm ? 'width: 95vw; height: 95vh; max-width: 95vw' : ''
		}
	},
	computed: {
		isMobileApplication () {
			return this.$q.platform.is.cordova
		}
	},
	methods: {
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
  .editable_block:hover {
    background-color: $primary!important;
  }

  .editor_token {
    display: inline-block;
    font-weight: 700;
    background-color: #7a7a7a61;
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
