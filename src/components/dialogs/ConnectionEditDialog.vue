<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card flat bordered class="q-dialog-plugin">
      <q-card-section>
        <q-input
          @input="inputHost($event)"
          :value="formData.api_host"
          :rules="[isValidHost]"
          label="Host"
          label-color="secondary"
          :prefix="prefix"
          :error="isValid('formErrors', 'api_host')"
          :error-message="formErrors.api_host"
        />
      </q-card-section>
      <q-card-actions vertical>
        <q-btn
          outline
          label="Update connection"
          @click="onOKClick"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { fieldValidationMixin } from 'src/pages/mixins/fieldValidation'

export default {
	name: 'ConnectionEditDialog',
	mixins: [fieldValidationMixin],
	data () {
		return {
			formData: {
				api_host: this.$store.getters['connection/API_HOST']
			},
			formErrors: {
				api_host: ''
			}
		}
	},
	methods: {
		show () {
			this.$refs.dialog.show()
		},

		hide () {
			this.$refs.dialog.hide()
		},

		onDialogHide () {
			this.$emit('hide')
		},

		onOKClick () {
			try {
				this.$store.dispatch('connection/UPDATE_API_HOST', this.formData.api_host)
				this.$emit('ok', this.formData)
				this.hide()
			} catch (e) {
				e.setErrors(this.formErrors)
			}
		},

		inputHost ($event) {
			this.dropErrors()
			this.formData.api_host = $event
		},

		dropErrors () {
			this.formErrors.api_host = ''
		},

		onCancelClick () {
			this.hide()
		}
	},
	computed: {
		prefix () {
			return !process.env.DEV ? 'https://' : 'http://'
		}
	}
}
</script>
