<template>
	<q-card-section class="q-py-sm">
		<!-- Section for create new or updated yours messages -->
		<!-- Section to show block "Add new message..." -->
		<q-card
			v-show="!isMessageEditable"
			@click="startMessaging"
			bordered
			:class="`q-pa-xs ${ $q.dark.isActive ? 'bg-dark' : 'bg-accent' }`">
			<q-card-section
				:class="`editable_block ${ $q.dark.isActive ? 'text-white' : 'text-dark'}`">
				Add new message...
			</q-card-section>
		</q-card>
		<!-- Section with editor -->
		<q-card-section
			v-show="isMessageEditable"
			class="q-pa-none">
			<Editor :ref="refsKey"
							v-model.trim="formMessage.description"
							@keyup.enter.native="handleEnter"/>
		</q-card-section>
		<q-card-actions
			v-show="isMessageEditable"
			class="q-mt-sm q-pa-none">
			<EditorSaveButton @click.native="createOrUpdateMessage"/>
			<EditorCancelButton @click.native="cancelEditingMessage"/>
		</q-card-actions>
	</q-card-section>
</template>

<script>
import Editor from '../Editor.vue'
import EditorSaveButton from '../../buttons/EditorSaveButton.vue'
import EditorCancelButton from '../../buttons/EditorCancelButton.vue'
import { Api } from '../../../services/api'
import { unWatch } from '../../../services/util'

export default {
	name: 'IssueDescriptionSection',
	components: {
		Editor,
		EditorSaveButton,
		EditorCancelButton
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
		unlock () {
			this.isMessageEditable = true
		},
		lock () {
			this.isMessageEditable = false
		},
		async handleEnter (e) {
			/** Handle Ctrl + Enter command in editor **/
			if (e.ctrlKey) {
				return await this.createOrUpdateMessage()
			}
		},
		startMessaging () {
			this.isMessageEditable = true
			this.focus()
		},
		cancelEditingMessage () {
			/** We use it if user wrote a message and clicked cancel then **/
			this.lock()

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
		}
	}
}
</script>

<style scoped>

</style>
