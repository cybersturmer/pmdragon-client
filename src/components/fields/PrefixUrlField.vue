<template>
  <q-input
    flat
    type="text"
		@keyup.enter="$emit('enter')"
    :rules="[isValidWorkspacePrefix]"
		:modelValue="value"
		@update:modelValue="handleUpdateModel"
		:error="isError"
    :error-message="errorMessage"
    label="Workspace prefix"
  />
</template>

<script>
import { fieldValidationMixin } from 'pages/mixins/fieldValidation'

export default {
	name: 'PrefixUrlField',
	emits: [
		'update:modelValue',
		'enter'
	],
	mixins: [fieldValidationMixin],
	props: {
		value: String,
		errorMessage: String
	},
	methods: {
		handleUpdateModel (value) {
			this.$emit('update:modelValue', value)
		}
	},
	computed: {
		isError () {
			try {
				return this.errorMessage.length > 0
			} catch (e) {
				return false
			}
		}
	}
}
</script>
