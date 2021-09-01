<template>
	<q-card-section class="q-py-none">
		<!-- Block with issue description -->
		<div class="q-mb-xs text-subtitle2 text-secondary text-uppercase">
			Description
		</div>
		<q-card
			v-show="isDescriptionReadOnly"
			flat
			bordered
			:class="`q-pa-xs ${ $q.dark.isActive ? 'bg-dark' : 'bg-accent' }`">
			<q-card-section
				v-html="issue.description || 'Add a description by clicking this area...'"
				:class="`editable_block ${ $q.dark.isActive ? 'text-white' : 'text-dark'} overflow-hidden q-pa-sm`"
				@click="startEditingDescription"/>
		</q-card>
		<EditorExtended
			ref="issueDescriptionEditor"
			v-show="isDescriptionEditing"
			:value="issue.description"
			@update:modelValue="handleIssueDescription($event)"
			:options="editorOptions"
			@enter="updateIssueDescription"
		/>
		<q-card-actions
			v-show="isDescriptionEditing"
			class="q-mt-sm q-pa-none">
			<EditorSaveButton @clicked="updateIssueDescription"/>
			<EditorCancelButton @clicked="cancelDescriptionEditing"/>
		</q-card-actions>
	</q-card-section>
</template>

<script>
import EditorSaveButton from 'src/components/buttons/EditorSaveButton'
import EditorCancelButton from 'src/components/buttons/EditorCancelButton'
import EditorExtended from 'components/elements/EditorExtended'
import { CoreActionsMixin } from 'src/services/actions/core'

export default {
	name: 'IssueDescriptionSection',
	mixins: [
		CoreActionsMixin
	],
	emits: [
		'update_description'
	],
	components: {
		EditorExtended,
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
			isDescriptionReadOnly: true,
			editorOptions: {
				placeholder: 'Add you description here...',
				height: '5em',
				minHeight: '5em',
				maxHeight: '7em',
				toolbar: [
					['bold', 'italic', 'underline'],
					['unordered', 'ordered'],
					['fullscreen'],
					['viewsource']
				]
			}
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
		async handleIssueDescription (value) {
			this.$emit('input', value)
		},
		async updateIssueDescription () {
			/** update Issue description
			 * we use it as a handler for description field changing **/
			const payload = {
				id: this.issue.id,
				description: this.issue.description
			}

			await this.patchIssue(payload)
			this.isDescriptionReadOnly = true

			this.$emit('updateDescription', payload)
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
