<template>
  <q-input
    flat
    type="text"
		@keyup.enter="$emit('enter')"
    :modelValue="username"
		@update:modelValue="handleInput"
		:error="isError"
    :error-message="errorMessage"
    label="Username"
  />
</template>

<script>
import { defineComponent } from 'vue'
import { fieldValidationMixin } from 'src/pages/mixins/fieldValidation'

export default defineComponent({
	name: 'UsernameField',
	emits: [
		'input'
	],
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
})
</script>
