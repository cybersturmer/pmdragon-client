<template>
  <q-page class="flex overflow-hidden">
    <q-card
    dark
    flat
    class="bg-secondary full-width">
      <q-card-section horizontal>
      <q-card-section class="col-md-9 col-xs-12 col-sm-12">
        <q-scroll-area
          dark
          style="height: 72vh; border-bottom: 1px solid #686868;">
          <!-- Title block -->
          <q-card-section>
            <!-- Title editing section -->
            <q-input
              dark
              :value="formData.issue.title"
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
          <!-- Description -->
          <q-card-section class="q-pt-xs">
            <!-- Block with issue description -->
            <div class="q-mb-xs text-subtitle2 text-amber">
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
              v-model="formData.issue.description"
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
            style="padding: 0"
          >
            <!-- Block with messages -->
            <q-card-section>
              <div class="q-mb-xs text-subtitle2 text-amber">
                Messages
              </div>
              <q-card
                dark
                flat
                bordered>
                <q-card-section
                  v-show="!thereAreMessages">
                  There are no messages for this issue
                </q-card-section>
                <q-card-section
                  v-show="thereAreMessages">
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
                      <div class="text-right">
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
      <q-separator dark vertical />
      <q-card-section class="col-md-3 xs-hide sm-hide">
        <!-- Right section, we can change issue data here -->
        <q-card-section align="right">
          <q-btn-group flat>
            <!-- Share button -->
            <q-btn
              flat
              dense
              icon="link"
              @click="copyLink"/>
            <!-- More button -->
            <q-btn
              flat
              dense
              icon="more_vert">
              <IssueMorePopupMenu
                :issue="formData.issue"/>
            </q-btn>
          </q-btn-group>
        </q-card-section>
        <q-card-section>
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
  </q-page>
</template>

<script>
import { editIssueMixin } from 'pages/mixins/editIssueMixin'

export default {
  name: 'Issue',
  mixins: [editIssueMixin]
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
</style>
