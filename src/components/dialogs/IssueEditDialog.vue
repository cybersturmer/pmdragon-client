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
      :style=" $q.screen.gt.sm ? 'width: 90vw; height: 90vh; max-width: 90vw;' : ''">
      <q-card-section :horizontal="$q.screen.gt.md" class="q-px-xs q-pb-none">
        <!-- We show this block only on small screen size (copyLink, more, close) -->
        <q-card-section v-if="$q.screen.lt.md" class="column items-end q-py-none">
          <IssueHeader :issue="formData.issue" class="col" @hide="hide"/>
        </q-card-section>
        <!-- Title block -->
        <IssueTitleSection v-if="$q.screen.lt.md" :issue="formData.issue"/>
        <q-card-section :class="`col-md-8 col-xs-12 col-sm-12 ${$q.screen.lt.md ? 'q-pa-xs': ''} overflow-hidden`">
          <IssueTitleSection v-if="$q.screen.gt.sm" :issue="formData.issue"/>
          <q-scroll-area
            ref="scrollArea"
            dark
            :style="`height: ${ $q.screen.gt.sm ? '65vh' : '70vh'}; border-bottom: 1px solid #686868;`">
            <q-card-section v-if="$q.screen.lt.md" class="q-pa-none">
              <IssueManageSection :issue="formData.issue"/>
            </q-card-section>
            <IssueUploaderSection :issue="formData.issue" />
            <!-- Description -->
            <q-card-section class="q-pt-xs">
              <!-- Block with issue description -->
              <div class="q-mb-xs text-subtitle2 text-amber text-uppercase">
                Description
              </div>
              <q-card
                v-show="!isDescriptionEditing"
                dark
                flat
                bordered>
                <q-card-section
                  v-html="formData.issue.description || 'Add a description by clicking this area...'"
                  class="editable_block text-amber"
                  @click="startEditingDescription"/>
              </q-card>
              <q-editor
                dark
                dense
                paragraph-tag="p"
                toolbar-toggle-color="amber"
                min-height="5rem"
                :toolbar="editorToolbar"
                ref="issueDescriptionEditor"
                v-model.trim="formData.issue.description"
                @keyup.enter="handleEnterDescription"
                @input="renderEditorMentioning(formData.issue.description, 'issueDescriptionEditor')"
                v-show="isDescriptionEditing"
              />
              <q-card-actions
                v-show="isDescriptionEditing"
                style="padding: 0"
                class="q-mt-sm">
                <EditorSaveButton @click.native="updateIssueDescription"/>
                <EditorCancelButton @click.native="cancelDescriptionEditing"/>
              </q-card-actions>
            </q-card-section>
            <!-- Messages -->
            <q-card-section
              style="padding: 0">
              <!-- Block with messages -->
              <q-card-section>
                <q-tabs
                  v-model="tab"
                  dense
                  narrow-indicator>
                  <q-tab name="messages" label="Messages" content-class="text-amber"/>
                  <q-tab name="history" label="History" content-class="text-amber"/>
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
                      bordered
                    >
                      <q-card-section>
                        <q-chat-message
                          v-for="message in messages"
                          :key="message.id"
                          :name="getParticipantTitleById(message.created_by)"
                          :sent="isItMe(message.created_by)"
                          :size="$q.screen.lt.sm ? '9' : '6'"
                          bg-color="accent"
                          text-color="amber">
                          <template #avatar>
                            <q-avatar v-if="getParticipantAvatarById(message.created_by)">
                              <img :src="getParticipantAvatarById(message.created_by)"
                                   class="q-message-avatar q-message-avatar--sent">
                            </q-avatar>
                          </template>
                          <template #default>
                            <q-list dense separator>
                              <q-slide-item
                                @right="startMessageEditing(message.id, $event)"
                                @left="removeMessage(message.id, $event)"
                                right-color="accent"
                                left-color="red-8"
                                class="text-amber bg-primary">
                                <template v-slot:right>
                                  <div class="row items-center">
                                    Edit
                                    <q-icon right name="mdi-comment-edit" />
                                  </div>
                                </template>
                                <template v-slot:left>
                                  <div class="row items-center">
                                    <q-icon left name="mdi-comment-remove" />
                                    Remove
                                  </div>
                                </template>
                                <q-item>
                                  <q-item-section v-html="message.description"/>
                                </q-item>
                              </q-slide-item>
                            </q-list>
                          </template>
                          <template #stamp>
                            {{ getRelativeDatetime(message.updated_at) }}
                          </template>
                        </q-chat-message>
                      </q-card-section>
                    </q-card>
                  </q-tab-panel>
                  <q-tab-panel
                    dark
                    name="history"
                    class="no-padding"
                  >
                    <q-card
                      dark
                      flat
                      bordered>
                      <q-card-section class="q-pt-xs q-pb-xs">
                        <q-timeline
                          :layout="timelineLayout"
                          color="amber"
                          dark>
                          <q-timeline-entry
                            v-for="entry in history"
                            :key="entry.id"
                            :title="buildTimeLineEntryTitle(entry)"
                            class="text-amber"
                            :subtitle="getRelativeDatetime(entry.updated_at)"
                            color="secondary"
                            :icon="entry.entry_type ? entry.entry_type : 'mdi-radiobox-marked'">
                            <div
                              v-if="isTimelineShowValues(entry)"
                              class="row items-center">
                              <span
                                v-if="entry.before_value"
                                v-html="entry.before_value"
                                class="q-pa-sm q-ma-xs bg-grey-10"
                                style="border: 1px solid gray; border-radius: 5px;">
                              </span>
                              <span
                                v-if="entry.after_value"
                                v-html="entry.after_value"
                                class="q-pa-sm q-ma-xs bg-accent"
                                style="border: 1px solid gray; border-radius: 5px;"
                              />
                            </div>
                          </q-timeline-entry>
                    </q-timeline>
                      </q-card-section>
                    </q-card>
                  </q-tab-panel>
                </q-tab-panels>
              </q-card-section>
            </q-card-section>
          </q-scroll-area>
            <!-- New Message Block -->
          <q-card-section class="q-pa-none">
            <q-card-section>
              <!-- Section for save new message -->
                <q-card
                  v-show="!isNewMessageEditing"
                  @click="startMessageCreating"
                  dark
                  bordered
                  class="editable_block">
                  <q-card-section
                    class="text-muted text-amber">
                    Add new message...
                  </q-card-section>
                </q-card>
                <q-card-section
                  v-show="isNewMessageEditing"
                  class="q-pa-none">
                  <q-editor
                    dark
                    dense
                    paragraph-tag="p"
                    toolbar-toggle-color="amber"
                    min-height="5rem"
                    max-height="15vh"
                    :toolbar="editorToolbar"
                    ref="issueMessageEditor"
                    v-model.trim="formNewMessage.description"
                    @keyup.enter="handleMessageEnter"
                    @input="renderEditorMentioning(formNewMessage.description, 'issueMessageEditor')"
                  />
                </q-card-section>
                <q-card-actions
                  v-show="isNewMessageEditing"
                  class="q-mt-sm">
                  <EditorSaveButton @click.native="createOrUpdateMessage"/>
                  <EditorCancelButton @click.native="cancelMessageEditing"/>
                </q-card-actions>
            </q-card-section>
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

export default {
	name: 'IssueEditDialog',
	components: {
	  IssueUploaderSection,
		IssueTitleSection,
		IssueHeader,
		IssueCreateUpdateSection,
		IssueManageSection
	},
	mixins: [
	  editIssueMixin
	],
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
    display: inline-flex;
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
</style>
