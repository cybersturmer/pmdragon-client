import { DATETIME_MASK } from 'src/services/masks'
import { ErrorHandler, unWatch } from 'src/services/util'
import { copyToClipboard, date } from 'quasar'
import { Api } from 'src/services/api'
import IssueMorePopupMenu from 'components/popups/IssueMorePopupMenu'
import EditorSaveButton from 'components/buttons/EditorSaveButton'
import EditorCancelButton from 'components/buttons/EditorCancelButton'
import { Dialogs } from 'pages/mixins/dialogs'
import { Notifications } from 'pages/mixins/notifications'

export const editIssueMixin = {
  components: { IssueMorePopupMenu, EditorSaveButton, EditorCancelButton },
  mixins: [Dialogs, Notifications],
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      editorToolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['viewsource'],
        ['undo', 'redo']
      ],
      isDescriptionEditing: false,
      formData: {
        issue: {
          title: '',
          description: ''
        }
      },
      formNewMessage: {
        issue: this.id,
        description: ''
      },
      isNewMessageEditing: false,
      editingMessageId: null,
      messages: [],
      mask: DATETIME_MASK
    }
  },
  async mounted () {
    this.formData.issue = unWatch(this.$store.getters['issues/ISSUE_BY_ID'](this.id))
    this.isDescriptionEditing = !this.formData.issue.description

    try {
      await this.getMessages()
    } catch (e) {
      this.showError(new ErrorHandler(e))
    }
  },
  methods: {
    copyLink () {
      /** Copy link to issue in buffer **/
      const host = this.$store.getters['connection/HOST']
      const text = `${host}/dash/issue/${this.formData.issue.id}`
      copyToClipboard(text)
        .then(() => this.showInformalNotification('Link copied to clipboard'))
    },
    getRelativeDatetime (datetime) {
      /** Get relative datetime for messages (example: "an hour ago") **/
      return this.$moment(datetime).fromNow()
    },
    getIssueStateById (id) {
      /** Get Issue state by Id, we got Issue State from props given to component **/
      return this.$store.getters['issues/ISSUE_STATE_BY_ID'](id)
    },
    getIssueTypeById (id) {
      /** Get Issue Type by Id, we got Issue Types from props given to component **/
      return this.$store.getters['issues/ISSUE_TYPE_BY_ID'](id)
    },
    getParticipantById (id) {
      /** Get participant object by given id from participants list given in props
       * It also can return Unassigned if given person was not found **/

      if (id === null) {
        return {
          id: null,
          first_name: 'Unassigned',
          last_name: ''
        }
      }

      return this.$store.getters['auth/PERSON_BY_ID'](id)
    },
    isItMe (id) {
      /** Return true if given id is current user id **/
      return id === this.$store.getters['auth/MY_USER_ID']
    },
    getParticipantTitleById (id) {
      /** return title with username, first name and last name as a String **/
      const participant = this.getParticipantById(id)
      return `@${participant.username} ( ${participant.first_name} ${participant.last_name} )`
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

      this.messages = response.data
    },
    getIssueTypeTitle (id) {
      /** get Title for given issue type id **/
      return this.$store.getters['issues/ISSUE_TYPE_TITLE_BY_ID'](id)
    },
    startEditingDescription () {
      /** update description state
       * We use it by clicking on the block with description of Issue
       * for make it editable **/
      this.isDescriptionEditing = true
      this.$nextTick(this.$refs.issueDescriptionEditor.focus)
    },
    async updateIssueState (state) {
      /** update state for Issue
       * We use it in selection field **/
      this.formData.issue.state_category = state.id
      const payload = {
        id: this.formData.issue.id,
        state_category: this.formData.issue.state_category
      }

      await this.$store.dispatch('issues/PATCH_ISSUE', payload)
      this.$emit('update_state', payload)
    },
    async updateIssueType (state) {
      /** update Issue type
       * we use it in selection field **/
      this.formData.issue.type_category = state.id
      const payload = {
        id: this.formData.issue.id,
        type_category: this.formData.issue.type_category
      }

      await this.$store.dispatch('issues/PATCH_ISSUE', payload)
      this.$emit('update_type', payload)
    },
    async updateIssueAssignee (assignee) {
      /** update Issue assignee
       * we use it in selection field **/
      this.formData.issue.assignee = assignee.id

      const payload = {
        id: this.formData.issue.id,
        assignee: assignee.id
      }

      await this.$store.dispatch('issues/PATCH_ISSUE', payload)
      this.$emit('update_assignee', payload)
    },
    async updateIssueEstimation (estimation) {
      this.formData.issue.estimation_category = estimation.id

      const payload = {
        id: this.formData.issue.id,
        estimation_category: estimation.id
      }

      await this.$store.dispatch('issues/PATCH_ISSUE', payload)
      this.$emit('update_estimation', payload)
    },
    async updateIssueTitle (title) {
      /** update Issue Title
       * we use it as a handler after text in input was changed
       * and user leave field by clicking outside **/
      this.formData.issue.title = title

      const payload = {
        id: this.formData.issue.id,
        title: title
      }

      await this.$store.dispatch('issues/PATCH_ISSUE', payload)
      this.$emit('update_title', payload)
    },
    async handleEnterDescription (e) {
      /** Handle Ctrl + Enter command in editor **/
      if (e.ctrlKey) {
        return await this.updateIssueDescription()
      }
    },
    async updateIssueDescription () {
      /** update Issue description
       * we use it as a handler for description field changing **/
      const payload = {
        id: this.formData.issue.id,
        description: this.formData.issue.description
      }

      await this.$store.dispatch('issues/PATCH_ISSUE', payload)
      this.isDescriptionEditing = false

      this.$emit('update_description', payload)
    },
    cancelDescriptionEditing () {
      /** We use this handler if user wrote something in Issue description
       * and clicked cancel then **/
      this.isDescriptionEditing = false
    },
    cancelMessageEditing () {
      /** We use it if user wrote a message and clicked cancel then **/
      this.isNewMessageEditing = false
      this.formNewMessage.description = ''
      this.editingMessageId = null
    },
    async _createMessage () {
      /** We use it for adding one more message **/
      const payload = this.formNewMessage
      const response = await new Api({
        auth: true,
        expectedStatus: 201
      })
        .post(
          '/core/issue-messages/',
          payload
        )

      this.messages.push(response.data)
    },
    async _updateMessage () {
      /** Kind of private method - we use it in create - update method **/
      const payload = {
        description: this.formNewMessage.description
      }

      const response = await new Api({
        auth: true,
        expectedStatus: 200
      })
        .patch(
          `/core/issue-messages/${this.editingMessageId}/`,
          payload
        )

      const oldMessage = this.messages
        .find(message => message.id === this.editingMessageId)

      const idx = this.messages
        .indexOf(oldMessage)

      this.messages.splice(idx, 1, response.data)
    },
    async handleMessageEnter (e) {
      /** Handle Ctrl + Enter command in editor **/
      if (e.ctrlKey) {
        return await this.createOrUpdateMessage()
      }
    },
    async createOrUpdateMessage () {
      /** We use it for adding one more message **/
      if (this.editingMessageId !== null) {
        await this._updateMessage()
      } else {
        await this._createMessage()
      }

      this.cancelMessageEditing()
    },
    checkMentioning (description) {
      /** Check Mentioning by checking all RegExp, pre-built
       * It also update participant object by defining index **/

      for (const participant of this.mentioningRegex) {
        const mentioned = description.match(participant.regex)
        if (mentioned) {
          participant.index = mentioned.index
          return participant
        }
      }

      return false
    },
    generateMentionedChip (participant) {
      /** generate username snippet for mentioned username **/
      return `&nbsp;<span class="editor_token" title="${participant.fullName}" data-mentioned-user-id="${participant.userId}" contenteditable="false">${participant.username}</span>&nbsp; `
    },
    async renderEditorMentioning (data, refsKey) {
      /** Replace @username to snippet with firstName-lastName non-editable block **/

      /** Firstly we have to check - do we have mentioning somewhere in the text **/
      const person = this.checkMentioning(data)
      if (!person) return false

      const editor = this.$refs[refsKey]
      const selection = editor.caret.selection

      /** Getting initial position of caret **/
      const currentPos = selection.focusOffset
      const currentNode = selection.focusNode

      /** Set selection for typed username and delete it from the document **/
      this._setSelection(currentNode, currentPos - (person.textLength + 1), currentPos)
      editor.caret.selection.deleteFromDocument()

      /** Set caret to initial position that was before username deletion **/
      this._setCaret(currentNode, currentPos)

      /** We generate placeholder and insert it in editor **/
      const placeholder = this.generateMentionedChip(person)
      this.$nextTick(editor.runCmd('insertHTML', placeholder, true))
      this.$nextTick(editor.focus)
    },
    _setSelection ($node, from, to) {
      const range = document.createRange()
      const sel = window.getSelection()

      range.setStart($node, from)
      range.setEnd($node, to)

      sel.removeAllRanges()
      sel.addRange(range)
    },
    _setCaret ($node, offset) {
      const range = document.createRange()
      const sel = window.getSelection()
      const innerTextLength = $node.length

      if (offset >= innerTextLength) return false

      range.setStart($node, innerTextLength)
      range.collapse(true)

      sel.removeAllRanges()
      sel.addRange(range)
    },
    startMessageEditing (id) {
      const message = this.messages.find(message => message.id === id)

      this.formNewMessage.description = message.description
      this.editingMessageId = id
      this.isNewMessageEditing = true
      this.$nextTick(this.$refs.issueMessageEditor.focus)
    },
    startMessageCreating () {
      this.isNewMessageEditing = true
      this.$nextTick(this.$refs.issueMessageEditor.focus)
    },
    async removeMessage (id) {
      await new Api({
        auth: true,
        expectedStatus: 204
      })
        .delete(
          `/core/issue-messages/${id}/`
        )

      this.messages = this.messages.filter((value) => {
        return value.id !== id
      })
    }
  },
  computed: {
    estimations () {
      return this.$store.getters['issues/ISSUE_ESTIMATIONS_BY_CURRENT_PROJECT']
    },
    states () {
      return this.$store.getters['issues/ISSUE_STATES_BY_CURRENT_PROJECT']
    },
    types () {
      return this.$store.getters['issues/ISSUE_TYPES_BY_CURRENT_PROJECT']
    },
    participants () {
      return this.$store.getters['auth/PARTICIPANTS_BY_CURRENT_PROJECT']
    },
    estimation () {
      return this.$store.getters['issues/ISSUE_ESTIMATION_BY_ID'](this.formData.issue.estimation_category)
    },
    estimationTitle () {
      try {
        return this.$store.getters['issues/ISSUE_ESTIMATION_BY_ID'](this.formData.issue.estimation_category).title
      } catch (e) {
        return 'None'
      }
    },
    createdAt () {
      return date.formatDate(this.formData.issue.created_at, DATETIME_MASK)
    },
    updatedAt () {
      return date.formatDate(this.formData.issue.updated_at, DATETIME_MASK)
    },
    thereAreMessages () {
      return this.messages.length > 0
    },
    isIssueTypeIcon () {
      return this.$store.getters['issues/IS_ISSUE_TYPE_HAVE_ICON'](this.formData.issue.type_category)
    },
    getIssueTypeIcon () {
      return this.$store.getters['issues/ISSUE_TYPE_ICON_BY_ID'](this.formData.issue.type_category)
    },
    mentioningRegex () {
      const regexArray = []
      for (const participant of this.participants) {
        regexArray.push({
          userId: participant.id,
          username: participant.username,
          fullName: `${participant.first_name} ${participant.last_name}`,
          regex: new RegExp(`@${participant.username}`, 'i'),
          index: null,
          textLength: participant.username.length
        })
      }

      return regexArray
    },
    issueTitleLabel () {
      /** get Issue title with Type and id of Issue **/
      const issueType = this.getIssueTypeTitle(this.formData.issue.type_category)
      return `#${this.formData.issue.id} ${issueType}`
    }
  }
}