<template>
  <q-card-section>
    <!-- Title editing section -->
    <q-input
      dark
      :value="issue.title"
      debounce="1000"
      @input="updateIssueTitle($event)"
      :label="issueTitleLabel"
      label-color="amber">
      <template v-slot:before>
        <q-icon
          v-if="isIssueTypeIcon"
          :name="issueTypeIconPrefix"
          :color="issueTypeIconColor"
          :title="issueTypeTitle"
          size="md"
        />
      </template>
    </q-input>
  </q-card-section>
</template>

<script>
export default {
	name: 'IssueTitleSection',
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
			this.issue.title = title

			const payload = {
				id: this.issue.id,
				title: title
			}

			await this.$store.dispatch('core/PATCH_ISSUE', payload)
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
			return this.$store.getters['core/ISSUE_TYPE_TITLE_BY_ID'](this.issue.id)
		},
		issueProjectNumber () {
		  return this.$store.getters['core/ISSUE_BY_ID_PROJECT_NUMBER'](this.issue.id)
		}
	}
}
</script>
