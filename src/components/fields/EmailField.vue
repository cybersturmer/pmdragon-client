<template>
  <q-input
    dark
    flat
    type="text"
    @input="handleInput"
    :value="email"
    :error="isError"
    :error-message="errorMessage"
    :rules="[isValidEmail]"
    label="Email"
    label-color="amber"
  />
</template>

<script>
import { fieldValidationMixin } from 'pages/mixins/fieldValidation'

export default {
	name: 'EmailField',
	mixins: [fieldValidationMixin],
	props: {
		value: String,
		errorMessage: String
	},
	data () {
		return {
			email: this.value
		}
	},
	methods: {
		handleInput (value) {
			this.email = value
			this.$emit('input', value)
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
