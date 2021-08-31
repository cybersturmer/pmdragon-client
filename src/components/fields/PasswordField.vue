<template>
	<q-input
		flat
		type="password"
		@keyup.enter="$emit('enter')"
		:modelValue="password"
		@update:modelValue="handleInput"
		:error="isError"
		:error-message="errorMessage"
		label="Password">
		<template #append>
			<q-btn
				v-if="canBeReset"
				flat
				:to="{ name: 'forgot' }"
				label="Forgot?"/>
		</template>
	</q-input>
</template>

<script>
import { fieldValidationMixin } from 'src/pages/mixins/fieldValidation'

export default {
	name: 'PasswordField',
	emits: [
		'input',
		'enter'
	],
	mixins: [fieldValidationMixin],
	props: {
		value: String,
		errorMessage: String,
		canBeReset: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	data () {
		return {
			password: this.value
		}
	},
	methods: {
		handleInput (value) {
			this.password = value
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
