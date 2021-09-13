<template>
  <q-page class="flex flex-center">
    <ChangeConnectionElement/>
    <q-card flat bordered style="width: 320px">
      <q-card-section class="q-pa-md">
        <div class="column">
					<form
						autocorrect="off"
						autocapitalize="off"
						autocomplete="off"
						spellcheck="false">
						<div class="col">
							<PrefixUrlField
								ref="prefixUrlField"
								v-model="formData.prefix_url"
								:errorMessage="formErrors.prefix_url"
							/>
						</div>
						<div class="col">
							<EmailField
								ref="emailField"
								v-model="formData.email"
								:errorMessage="formErrors.email"
								@enter="register"
							/>
						</div>
					</form>
        </div>
        </q-card-section>
        <q-card-section class="row q-pt-none justify-between">
					<div class="col-5">
            <q-btn
              outline
							label="Sign Up"
							@click="register"/>
					</div>
					<div class="col-4">
						<router-link :to="{ name: 'login' }" custom v-slot="{ navigate }">
							<q-btn
								flat
								color="secondary"
								label="Login?"
								@click="navigate"
								@keypress.enter="navigate"/>
						</router-link>
					</div>
        </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { fieldValidationMixin } from 'src/pages/mixins/fieldValidation'
import { Dialogs } from 'src/pages/mixins/dialogs'
import PrefixUrlField from 'src/components/fields/PrefixUrlField'
import EmailField from 'src/components/fields/EmailField'
import ChangeConnectionElement from 'components/elements/GeneralSettingsElement'
import { AuthActionsMixin } from 'src/services/actions/auth'

export default defineComponent({
	name: 'Register',
	components: { EmailField, PrefixUrlField, ChangeConnectionElement },
	mixins: [
		Dialogs,
		fieldValidationMixin,
		AuthActionsMixin
	],
	data () {
		return {
			formData: {
				prefix_url: '',
				email: ''
			},
			formErrors: {
				prefix_url: '',
				email: ''
			}
		}
	},
	methods: {
		async register () {
			if (this.formData.prefix_url.length < 1 || this.formData.email.length < 1) {
				this.showRaisedError('Please input workspace url and email')
				return false
			}

			try {
				await this.addPersonRegistrationRequest(this.formData)
				const dialog = [
					'Congratulations',
					"We've sent you an email." +
          '<br>Please follow the link inside of it. ' +
          '<br> Link is valid only 24 hours',
					true
				]

				this.formData.prefix_url = ''
				this.formData.email = ''

				this.resetFieldsErrorMessages('formErrors', [
					'prefix_url',
					'email'
				])

				this.showOkDialog(...dialog)
			} catch (e) {
				e.setErrors(this.formErrors)
			}
		}
	}
})
</script>
