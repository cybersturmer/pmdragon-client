<template>
  <q-card-section>
    <!-- Readonly props such as created at and updated at -->
    <q-input
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
			flat
			square
			readonly
			:value="createdBy"
			label="Created By"
			label-color="amber"
		/>
    <q-input
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
</template>

<script>
import { DATETIME_MASK } from 'src/services/masks'
import { date } from 'quasar'

export default {
	name: 'IssueCreateUpdateSection',
	props: {
	  issue: {
	    type: Object,
			required: true
		}
	},
	computed: {
	  mask () {
	    return DATETIME_MASK
		},
		createdAt () {
			return date.formatDate(this.issue.created_at, DATETIME_MASK)
		},
		createdBy () {
			if ('created_by' in this.issue) {
				return this.$store.getters['auth/PERSON_FULL_NAME_BY_ID'](this.issue.created_by)
			} else {
				return ''
			}
		},
		updatedAt () {
			return date.formatDate(this.issue.updated_at, DATETIME_MASK)
		}
	}
}
</script>
