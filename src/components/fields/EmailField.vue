<template>
	<q-input
		flat
		type="text"
		@keyup.enter="$emit('enter')"
		:modelValue="email"
		@update:modelValue="handleInput"
		:error="isError"
		:error-message="errorMessage"
		:rules="[isValidEmail]"
		label="Email"
	/>
</template>

<script>
import { defineComponent } from 'vue'
import { fieldValidationMixin } from 'src/pages/mixins/fieldValidation'

export default defineComponent({
	name: 'EmailField',
	emits: [
		'enter',
		'input'
	],
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
})
</script>
