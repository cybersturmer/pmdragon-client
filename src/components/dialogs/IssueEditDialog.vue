<template>
  <q-dialog
    ref="dialog"
    @hide="onDialogHide">
    <q-card
      dark
      flat
      bordered
      class="q-dialog-plugin bg-secondary"
      style="width: 85vw; max-width: 85vw;">
      <q-card-section horizontal>
        <q-card-section class="col-md-8 col-xs-12 col-sm-12">
          <!-- @todo Breadcrumbs for current issue -->
          <q-scroll-area
            ref="scrollArea"
            dark
            style="height: 65vh; border-bottom: 1px solid #686868;">
            <!-- Title block -->
            <q-card-section>
              <!-- Title editing section -->
              <q-input
                dark
                :value="formData.issue.title"
                debounce="1000"
                @input="updateIssueTitle($event)"
                :label="issueTitleLabel"
                label-color="amber">
                <template v-slot:before>
                  <q-icon
                    v-if="isIssueTypeIcon"
                    :name="getIssueTypeIcon.prefix"
                    :color="getIssueTypeIcon.color"
                    :title="getIssueTypeTitle(formData.issue.type_category)"
                    size="md"
                  />
                </template>
              </q-input>
            </q-card-section>
            <!-- Attachments -->
            <q-card-section>
              <q-uploader
                dark
                flat
                ref="uploader"
                auto-upload
                :factory="uploadFileAttachment"
                :max-file-size="10485760"
                class="full-width"
              >
                <template #header>
                  <div>
                    <span v-if="$q.screen.gt.sm"
                      class="text-bold text-amber">
                      ATTACHMENTS {{ attachmentsAmount }}
                    </span>
                    <q-btn
                      dense
                      flat
                      label="Upload file"
                      class="q-pl-sm q-pr-sm"
                      icon="mdi-upload">
                      <q-uploader-add-trigger />
                    </q-btn>
                    <q-btn
                      dense
                      flat
                      label="Link file"
                      class="q-pl-sm q-pr-sm"
                      icon="mdi-link-plus"
                      @click="showSelectAttachmentDialog"
                    />
                  </div>
                </template>
                <template #list>
                  <q-scroll-area
                    dark
                    horizontal
                    visible
                    style="height: 55px;"
                    class="bg-primary rounded-borders full-width"
                  >
                    <div class="row no-wrap">
                      <div
                        v-for="attachment in attachments"
                        :key="attachment.id"
                        class="q-pa-sm truncate-chip-labels">
                        <q-chip
                          dark
                          square
                          removable
                          clickable
                          color="primary"
                          :icon="attachment.icon"
                          :label="attachment.title"
                          @remove="deleteFileAttachmentFromIssue(attachment)"
                          @click="downloadFile(attachment.attachment)"
                        />
                      </div>
                    </div>
                  </q-scroll-area>
                </template>
              </q-uploader>
            </q-card-section>
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
                bordered
              >
                <q-card-section
                  v-html="formData.issue.description || 'Add a description by clicking this area...'"
                  class="q-pa-md editable_block"
                  @click="startEditingDescription"
                />
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
                  <q-tab name="messages" label="Messages"/>
                  <q-tab name="history" label="History"/>
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
                          v-bind:key="message.id"
                          :name="getParticipantTitleById(message.created_by)"
                          :avatar="getParticipantById(message.created_by).avatar"
                          size="6"
                          :text-sanitize="false"
                          bg-color="accent"
                          text-color="amber"
                          :sent="isItMe(message.created_by)"
                        >
                          <template #default>
                            <div v-html="message.description"/>
                            <div class="text-left q-message-stamp">
                              {{ getRelativeDatetime(message.updated_at) }}
                            </div>
                            <div
                              v-show="$q.screen.gt.sm"
                              class="text-right">
                              <q-btn-group
                                v-show="isItMe(message.created_by)"
                                outline
                                class="bottom-right">
                                <q-btn
                                  size="sm"
                                  label="edit"
                                  @click="startMessageEditing(message.id)"
                                />
                                <q-btn
                                  size="sm"
                                  label="delete"
                                  @click="removeMessage(message.id)"
                                />
                              </q-btn-group>
                            </div>
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
                          color="accent"
                          dark>
                          <q-timeline-entry
                            v-for="entry in history"
                            :key="entry.id"
                            :title="buildTimeLineEntryTitle(entry)"
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
                                class="q-pa-sm q-ma-xs bg-blue-grey-10"
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
          <q-card-section style="padding: 0">
            <q-card-section>
              <!-- Section for save new message -->
                <q-card
                  v-show="!isNewMessageEditing"
                  @click="startMessageCreating"
                  dark
                  bordered
                  class="editable_block">
                  <q-card-section class="text-muted">
                    Add new message...
                  </q-card-section>
                </q-card>
                <q-card-section
                  v-show="isNewMessageEditing"
                  style="padding: 0">
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
        <q-card-section class="col-md-4 xs-hide sm-hide">
        <!-- Right section, we can change issue data here -->
          <q-card-section align="right">
            <q-btn-group flat>
              <!-- Share button -->
              <q-btn
                flat
                dense
                icon="mdi-link-variant"
                @click="copyLink"/>
              <!-- More button -->
              <q-btn
                flat
                dense
                icon="mdi-dots-vertical">
                <IssueMorePopupMenu
                  v-on:remove="hide"
                  :issue="formData.issue"/>
              </q-btn>
              <q-btn
                flat
                dense
                icon="mdi-close"
                @click="hide"
              ></q-btn>
            </q-btn-group>
          </q-card-section>
          <q-card-section>
            <!-- Selection for issue state -->
            <!-- Selection for issue state -->
            <q-select
              dark
              flat
              square
              dense
              :value="getIssueStateById(formData.issue.state_category)"
              @input="updateIssueState($event)"
              :options="states"
              option-label="title"
              option-value="id"
            />
            <!-- Selection for issue type -->
            <q-select
              dark
              flat
              square
              dense
              :value="getIssueTypeById(formData.issue.type_category)"
              @input="updateIssueType($event)"
              :options="types"
              option-label="title"
              option-value="id"
            />
            <!-- Selection for assignee -->
            <q-select
              dark
              flat
              square
              dense
              :value="getParticipantById(formData.issue.assignee)"
              @input="updateIssueAssignee($event)"
              :options="participants"
              :option-label="(item) => `${item.first_name} ${item.last_name}`"
              option-value="id"
            />
            <!-- Selection for story points -->
            <q-select
              dark
              flat
              square
              dense
              :value="estimation"
              @input="updateIssueEstimation($event)"
              :options="estimations"
              :option-label="(item) => item ? `${item.title}`: 'None'"
              option-value="id"
            />
          </q-card-section>
          <q-card-section>
            <!-- Readonly props such as created at and updated at -->
            <q-input
              dark
              flat
              square
              readonly
              :value="createdAt"
              :mask="mask"
              type="datetime"
              label="Created at"
              label-color="amber"
            />
            <q-input
              dark
              flat
              square
              readonly
              :value="updatedAt"
              :mask="mask"
              type="datetime"
              label="Updated at"
              label-color="amber"
            />
          </q-card-section>
        </q-card-section>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { editIssueMixin } from 'pages/mixins/editIssueMixin'

export default {
  name: 'IssueEditDialog',
  mixins: [editIssueMixin],
  methods: {
    show () {
      this.$refs.dialog.show()
    },

    hide () {
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
