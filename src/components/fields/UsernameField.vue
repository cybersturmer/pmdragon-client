<template>
  <q-input
    flat
    type="text"
    @input="handleInput"
    :value="username"
    :error="isError"
    :error-message="errorMessage"
    label="Username"
  />
</template>

<script>
import { fieldValidationMixin } from 'src/pages/mixins/fieldValidation'

export default {
	name: 'UsernameField',
	mixins: [fieldValidationMixin],
	props: {
		value: String,
		errorMessage: String
	},
	data () {
		return {
			username: this.value
		}
	},
	methods: {
		handleInput (value) {
			this.username = value
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
