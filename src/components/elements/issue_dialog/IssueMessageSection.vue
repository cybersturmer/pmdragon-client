<template>
	<q-card-section class="q-py-sm">
		<!-- Section for create new or updated yours messages -->
		<!-- Section with editor and popup -->
		<q-card-section
			class="q-pa-none">
			<!-- Editor (Like Textarea) -->
			<EditorExtended :ref="refsKey"
											:value="formMessage.description"
											:options="editorOptions"
											@input="formMessage.description = $event"
											placeholder="Create new message here..."
			/>
		</q-card-section>
		<q-card-actions
			align="right"
			class="q-mt-sm q-pa-none">
			<!-- Create or Update Button -->
			<q-btn outline
						 icon-right="mdi-send"
						 color="secondary"
						 :label="actionButtonLabel"
						 @click="createOrUpdateMessage"/>
		</q-card-actions>
	</q-card-section>
</template>

<script>
import { Api } from 'src/services/api'
import { unWatch } from 'src/services/util'
import EditorExtended from 'components/elements/EditorExtended'

export default {
	name: 'IssueDescriptionSection',
	emits: [
		'cancelEditingMessage'
	],
	components: {
		EditorExtended
	},
	props: {
		issueId: {
			type: Number,
			required: true
		},
		editingMessageId: {
			type: Number,
			required: false,
			default: null
		},
		description: {
			type: String,
			required: false,
			default: ''
		}
	},
	watch: {
		editingMessageId (newId, oldId) {
			if (oldId === null && newId !== null) {
				this.formMessage.description = this.$store.getters['current/ISSUE_MESSAGE_BY_ID'](newId).description
			}
		}
	},
	data () {
		return {
			refsKey: 'issueMessageEditor',
			isMessageEditable: false,
			isMentioningPopupVisible: false,
			popupParticipantsFilter: '',
			editorOptions: {
				placeholder: 'Start typing your message here...',
				height: '5em',
				minHeight: '5em',
				maxHeight: '7em',
				toolbar: [
					['bold', 'italic', 'underline'],
					['unordered', 'ordered'],
					['fullscreen'],
					['viewsource']
				]
			},
			formMessage: {
				issue: this.issueId,
				description: ''
			}
		}
	},
	methods: {
		focus () {
			this.$nextTick(this.messageEditor.focus)
		},
		cancelEditingMessage () {
			/** We use it if user wrote a message and clicked cancel then **/
			this.formMessage.description = ''
			this.$emit('cancelEditingMessage')
		},
		async _createMessage () {
			/** We use it for adding one more message **/
			if (!this.formMessage.description) return false

			const payload = {
				issue: this.issueId,
				description: this.formMessage.description
			}

			const response = await new Api({
				auth: true,
				expectedStatus: 201
			})
				.post(
					'/core/issue-messages/',
					payload
				)

			const messagesClone = unWatch(this.messages)
			messagesClone.push(response.data)
			this.$store.commit('current/SET_ISSUE_MESSAGES', messagesClone)
		},
		async _updateMessage () {
			/** Kind of private method - we use it in create - update method **/
			const payload = {
				description: this.formMessage.description
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

			const messagesClone = unWatch(this.messages)
			messagesClone.splice(idx, 1, response.data)
			this.$store.commit('current/SET_ISSUE_MESSAGES', messagesClone)
		},
		async createOrUpdateMessage () {
			/** We use it for adding one more message or update the previous one **/
			if (this.isNewMessage) {
				await this._createMessage()
			} else {
				await this._updateMessage()
			}

			this.cancelEditingMessage()
		}
	},
	computed: {
		messageEditor () {
			return this.$refs.issueMessageEditor
		},
		messages () {
			return this.$store.getters['current/ISSUE_MESSAGES']
		},
		isNewMessage () {
			return this.editingMessageId === null
		},
		actionButtonLabel () {
			return this.isNewMessage ? 'Send' : 'Update'
		}
	}
}
</script>

<style scoped>

</style>
