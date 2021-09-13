<template>
	<q-card-section class="q-py-sm">
		<!-- Title editing section -->
		<q-input
			dense
			:modelValue="issue.title"
			@update:modelValue="updateIssueTitle($event)"
			debounce="1000"
			:label="issueTitleLabel"
			label-color="secondary">
			<template v-slot:before>
				<q-icon
					v-if="isIssueTypeIcon"
					:name="issueTypeIconPrefix"
					:style="`color: ${issueTypeIconColor}`"
					:title="issueTypeTitle"
					size="md"
				/>
			</template>
		</q-input>
	</q-card-section>
</template>

<script>
import { defineComponent } from 'vue'
import { CoreActionsMixin } from 'src/services/actions/core'

export default defineComponent({
	name: 'IssueTitleSection',
	mixins: [
		CoreActionsMixin
	],
	emits: [
		'update_title'
	],
	props: {
		issue: {
			type: Object,
			required: true
		}
	},
	methods: {
		async updateIssueTitle (title) {
			/** update Issue Title
			 * we use it as a handler after text in input was changed
			 * and user leave field by clicking outside **/
			const payload = {
				id: this.issue.id,
				title: title
			}

			await this.patchIssue(payload)
			this.$emit('update_title', payload)
		}
	},
	computed: {
		issueTitleLabel () {
			/** get Issue title with Type and id of Issue **/
			return `#${this.issueProjectNumber} ${this.issueTypeTitle}`
		},
		issueTypeIcon () {
			return this.$store.getters['core/ISSUE_TYPE_ICON_BY_ISSUE_TYPE_CATEGORY_ID'](this.issue.type_category)
		},
		isIssueTypeIcon () {
			return this.$store.getters['core/IS_ISSUE_TYPE_HAVE_ICON'](this.issue.type_category)
		},
		issueTypeIconPrefix () {
			try {
				return this.issueTypeIcon.prefix
			} catch (e) {
				return ''
			}
		},
		issueTypeIconColor () {
			try {
				return this.issueTypeIcon.color
			} catch (e) {
				return ''
			}
		},
		issueTypeTitle () {
			/** get Title for given issue type id **/
			return this.$store.getters['core/ISSUE_TYPE_TITLE_BY_ID'](this.issue.type_category)
		},
		issueProjectNumber () {
			return this.$store.getters['core/ISSUE_BY_ID_PROJECT_NUMBER'](this.issue.id)
		}
	}
})
</script>
