<template>
	<q-card-section class="q-py-none">
		<!-- Block with issue description -->
		<div class="q-mb-xs text-subtitle2 text-amber text-uppercase">
			Description
		</div>
		<q-card
			v-show="isDescriptionReadOnly"
			dark
			flat
			bordered
			class="q-pa-xs"
		>
			<q-card-section
				v-html="issue.description || 'Add a description by clicking this area...'"
				class="editable_block text-amber overflow-hidden q-pa-sm"
				@click="startEditingDescription"/>
		</q-card>
		<Editor v-show="isDescriptionEditing"
						:ref="refsKey"
						v-model.trim="issue.description"
						@keyup.enter.native="handleEnterDescription"/>
		<q-card-actions
			v-show="isDescriptionEditing"
			class="q-mt-sm q-pa-none">
			<EditorSaveButton @click.native="updateIssueDescription"/>
			<EditorCancelButton @click.native="cancelDescriptionEditing"/>
		</q-card-actions>
	</q-card-section>
</template>

<script>
import Editor from '../Editor.vue'
import EditorSaveButton from '../../buttons/EditorSaveButton.vue'
import EditorCancelButton from '../../buttons/EditorCancelButton.vue'

export default {
	name: 'IssueDescriptionSection',
	components: {
		Editor,
		EditorSaveButton,
		EditorCancelButton
	},
	props: {
		issue: {
			type: Object,
			required: true
		}
	},
	data () {
		return {
			refsKey: 'issueDescriptionEditor',
			isDescriptionReadOnly: true
		}
	},
	methods: {
		startEditingDescription () {
			/** update description state
			 * We use it by clicking on the block with description of Issue
			 * for make it editable **/
			this.isDescriptionReadOnly = false
			this.$nextTick(this.descriptionEditor.focus)
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
				id: this.issue.id,
				description: this.issue.description
			}

			await this.$store.dispatch('core/PATCH_ISSUE', payload)
			this.isDescriptionReadOnly = true

			this.$emit('update_description', payload)
		},
		cancelDescriptionEditing () {
			/** We use this handler if user wrote something in Issue description
			 * and clicked cancel then **/
			this.isDescriptionReadOnly = true
		}
	},
	computed: {
		isDescriptionEditing () {
			return !this.isDescriptionReadOnly
		},
		descriptionEditor () {
			return this.$refs.issueDescriptionEditor
		}
	}
}
</script>

<style scoped>

</style>
