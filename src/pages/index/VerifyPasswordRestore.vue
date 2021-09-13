<template>
  <q-page class="flex flex-center">
		<ChangeConnectionElement/>
    <q-card
      v-if="isPasswordForgotRequestValid"
      flat
      bordered
      class="my-card" style="width: 320px">
      <q-card-section>
        <PasswordField
          v-model="formData.new_password1"
          :error-message="formErrors.new_password1"
        />
        <PasswordField
          v-model="formData.new_password2"
          :error-message="formErrors.new_password2"
        />
      </q-card-section>
      <q-card-actions vertical>
        <q-btn
          outline
          color="secondary"
          @click="passwordUpdate">
          Confirm
        </q-btn>
      </q-card-actions>
    </q-card>
    <q-card
      v-else
      flat
      bordered
      class="my-card">
      <q-card-section class="text-center">
        <div class="text-h6">This link is expired or have already been used.</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import PasswordField from 'components/fields/PasswordField'
import { Dialogs } from 'pages/mixins/dialogs'
import { fieldValidationMixin } from 'pages/mixins/fieldValidation'
import { ErrorHandler } from 'src/services/util'
import ChangeConnectionElement from 'components/elements/GeneralSettingsElement'

export default defineComponent({
	name: 'VerifyPasswordRestore',
	mixins: [Dialogs, fieldValidationMixin],
	components: {
		PasswordField,
		ChangeConnectionElement
	},
	data () {
		return {
			isPasswordForgotRequestValid: false,
			formData: {
				key: this.$attrs.key,
				new_password1: '',
				new_password2: ''
			},
			formErrors: {
				key: '',
				new_password1: '',
				new_password2: ''
			}
		}
	},
	async mounted () {
		try {
			await this.$http
				.auth(false)
				.expect(200)
				.get(`/auth/person-password-forgot-requests/${this.$attrs.key}/`)

			this.isPasswordForgotRequestValid = true
		} catch (e) {
			this.isPasswordForgotRequestValid = false
		}
	},
	methods: {
		async passwordUpdate () {
			/**
       * @todo Let's implement this
       * We have to send:
       * 1) Token to verify that it's me
       * 2) New password
       * 3) One more time new password
       * As a result we have to change password for user
       * */
			const payload = {
				new_password1: this.formData.new_password1,
				new_password2: this.formData.new_password2
			}

			try {
				await this.$http
					.auth(false)
					.expect(200)
					.patch(
						`/auth/person-password-forgot-requests/${this.$attrs.key}/`,
						payload
					)

				this.showOkDialog(
					'Password successfully changed',
					'Your password was successfully changed, now you can login using new password.'
				)
					.onOk(() => {
						this.$router.push({ name: 'login' })
					})
			} catch (e) {
				const error = new ErrorHandler(e)
				error.setErrors(this.formErrors)

				this.showError(error)
			}
		}
	}
})
</script>
