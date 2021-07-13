<template>
  <q-input
    flat
    type="password"
    @input="handleInput"
    :value="password"
    :error="isError"
    :error-message="errorMessage"
    label-color="amber"
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
import { fieldValidationMixin } from 'pages/mixins/fieldValidation'

export default {
	name: 'PasswordField',
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
