<template>
  <q-card-section>
    <!-- Readonly props such as created at and updated at -->
    <q-input
      flat
      square
      readonly
      :modelValue="createdAt"
      :mask="mask"
      type="datetime"
      label="Created at"
      label-color="secondary"
    />
		<q-input
			flat
			square
			readonly
			:modelValue="createdBy"
			label="Created By"
			label-color="secondary"
		/>
    <q-input
      flat
      square
      readonly
      :modelValue="updatedAt"
      :mask="mask"
      type="datetime"
      label="Updated at"
      label-color="secondary"
    />
  </q-card-section>
</template>

<script>
import { defineComponent } from 'vue'
import { DATETIME_MASK } from 'src/services/masks'
import { date } from 'quasar'

export default defineComponent({
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
})
</script>
