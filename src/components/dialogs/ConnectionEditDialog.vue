<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card flat bordered class="q-dialog-plugin">
      <q-card-section>
        <q-input
					autofocus
          @update:modelValue="inputHost($event)"
          :modelValue="formData.api_host"
          :rules="[isValidHost]"
          label="Host"
          label-color="secondary"
          :prefix="`${prefix}://`"
          :error="isValid('formErrors', 'api_host')"
          :error-message="formErrors.api_host"
					@keyup.enter="onOKClick"
        />
      </q-card-section>
      <q-card-actions vertical>
        <q-btn
					:loading="connectionChecking"
          outline
          label="Update connection"
					@click="onOKClick">
					<template v-slot:loading>
						Testing Host
						<q-spinner-dots class="on-right" />
					</template>
				</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from 'vue'
import { fieldValidationMixin } from 'src/pages/mixins/fieldValidation'
import { Dialogs } from 'src/pages/mixins/dialogs'
import { ConnectionActionsMixin } from 'src/services/actions/connection'

export default defineComponent({
	name: 'ConnectionEditDialog',
	emits: [
		'ok',
		'hide'
	],
	mixins: [
		ConnectionActionsMixin,
		fieldValidationMixin,
		Dialogs
	],
	data () {
		return {
			connectionChecking: false,
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

		async checkConnection () {
			await this.$store.dispatch('connection/UPDATE_API_HOST', this.formData.api_host)
			this.$http.updateOptions()
			this.$http.createInstance()

			return await this.check()
		},

		async onOKClick () {
			this.connectionChecking = true

			try {
				await this.checkConnection()

				this.$emit('ok', this.formData)
				this.hide()
			} catch (e) {
				const protocolUpperCased = this.prefix.toUpperCase()
				this.formErrors.api_host = `${e.origin.message}. ${protocolUpperCased} for the host is unreachable.`
			} finally {
				this.connectionChecking = false
			}
		},

		inputHost ($event) {
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
			return this.$store.getters['connection/REST_PROTOCOL']
		}
	}
})
</script>
