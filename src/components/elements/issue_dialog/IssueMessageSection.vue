<template>
	<q-card-section class="q-py-sm">
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
			<Editor :ref="refsKey"
							v-model="description"
							@keyup.enter.native="handleMessageEnter"/>
		</q-card-section>
		<q-card-actions
			v-show="isNewMessageEditing"
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
		editingMessageId: {
			type: Number,
			required: false,
			default: null
		},
		description: {
			type: String,
			required: true
		}
	},
	data () {
		return {
			refsKey: 'issueMessageEditor',
			isNewMessageEditing: false
		}
	},
	methods: {
		async handleMessageEnter (e) {
			/** Handle Ctrl + Enter command in editor **/
			if (e.ctrlKey) {
				return await this.createOrUpdateMessage()
			}
		},
		startMessageCreating () {
			this.isNewMessageEditing = true
			this.$nextTick(this.messageEditor.focus)
		},
		startEditingMessage (id, chat) {
			chat.reset()

			const message = this.messages.find(message => message.id === id)

			this.formNewMessage.description = message.description
			this.editingMessageId = id
			this.isNewMessageEditing = true

			this.$nextTick(this.messageEditor.focus)
		},
		cancelEditingMessage () {
			/** We use it if user wrote a message and clicked cancel then **/
			this.isNewMessageEditing = false
			this.formNewMessage.description = ''
			this.editingMessageId = null
		},
		async _updateMessage () {
			/** Kind of private method - we use it in create - update method **/
			const payload = {
				description: this.description
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
			/** We use it for adding one more message **/
			if (this.editingMessageId !== null) {
				await this._updateMessage()
			} else {
				await this._createMessage()
			}

			this.cancelEditingMessage()
		},
		async removeMessage (id, chat) {
			chat.reset()

			await new Api({
				auth: true,
				expectedStatus: 204
			})
				.delete(
					`/core/issue-messages/${id}/`
				)

			const messagesClone = this.messages.filter((value) => {
				return value.id !== id
			})

			this.$store.commit('current/SET_ISSUE_MESSAGES', messagesClone)
		}
	},
	computed: {
		messageEditor () {
			return this.$refs.issueMessageEditor
		},
		messages () {
			return this.$store.getters['current/ISSUE_MESSAGES']
		}
	}
}
</script>

<style scoped>

</style>
