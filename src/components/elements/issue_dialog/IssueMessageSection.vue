<template>
	<q-card-section class="q-py-sm">
		<!-- Section for create new or updated yours messages -->
		<!-- Section with editor and popup -->
		<q-card-section
			class="q-pa-none">
			<!-- Editor (Like Textarea) -->
			<EditorExtended :ref="refsKey"
											:modelValue="formMessage.description"
											:options="editorOptions"
											@update:modelValue="formMessage.description = $event"
											@enter="createOrUpdateMessage"
											placeholder="Create new message here..."
			/>
		</q-card-section>
		<q-card-actions
			align="right"
			class="q-mt-sm q-pa-none">
			<!-- Create or Update Button -->
			<q-btn outline
						 color="secondary"
						 :label="actionButtonLabel"
						 icon-right="mdi-keyboard-return"
						 class="q-px-sm"
						 title="Ctrl + Enter"
						 @click="createOrUpdateMessage"/>
		</q-card-actions>
	</q-card-section>
</template>

<script>
import EditorExtended from 'components/elements/EditorExtended'
import { Dialogs } from 'pages/mixins/dialogs'
import { CurrentActionsMixin } from 'src/services/actions/current'
import MessagesPacker from 'src/store/current/messages'
import { unWatch } from 'src/services/util'

export default {
	name: 'IssueDescriptionSection',
	emits: [
		'cancelEditingMessage'
	],
	mixins: [
		Dialogs,
		CurrentActionsMixin
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
			packer: new MessagesPacker(
				this.$store.getters['auth/PERSONS'],
				this.$store.getters['auth/MY_PERSON_ID']
			),
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
		async addMessageEvent () {
			/** We use it for adding one more message **/
			if (!this.formMessage.description) return false

			const payload = {
				issue: this.issueId,
				description: this.formMessage.description
			}

			try {
				const rawMessage = await this.addMessage(payload)

				this.packer.setPackedMessages(this.messages)
				this.packer.addRawMessageToPack(rawMessage.data)

				this.$store.commit('current/SET_ISSUE_MESSAGES', this.packer.packedMessages)
			} catch (e) {
				console.log(e)
				this.showError(e)
			}
		},
		async updateMessageEvent () {
			/** Kind of private method - we use it in create - update method **/
			if (!this.formMessage.description) return false

			const payload = {
				id: this.editingMessageId,
				description: this.formMessage.description
			}

			try {
				const rawMessage = await this.updateMessage(payload)

				this.packer.setPackedMessages(this.messages)
				this.packer.updateMessageFromThePack(rawMessage.data)

				this.$store.commit('current/SET_ISSUE_MESSAGES', this.packer.packedMessages)
			} catch (e) {
				this.showError(e)
			}
		},
		async createOrUpdateMessage () {
			/** We use it for adding one more message or update the previous one **/
			if (this.isNewMessage) {
				await this.addMessageEvent()
			} else {
				await this.updateMessageEvent()
			}

			this.cancelEditingMessage()
		}
	},
	computed: {
		messageEditor () {
			return this.$refs.issueMessageEditor
		},
		messages () {
			return unWatch(this.$store.getters['current/ISSUE_MESSAGES'])
		},
		isNewMessage () {
			return this.editingMessageId === null
		},
		actionButtonLabel () {
			return this.isNewMessage ? 'Send' : 'Update'
		},
		persons () {
			return this.$store.getters['auth/PERSONS']
		}
	}
}
</script>

<style scoped>

</style>
