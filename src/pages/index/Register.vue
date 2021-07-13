<template>
  <q-page class="flex flex-center">
    <ChangeConnectionElement/>
    <q-card bordered flat class="my-card" style="width: 320px">
      <q-card-section class="q-pa-md">
        <div class="column">
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
              @keyup.enter.native="resetFieldErrorMessage('formErrors','email')"
            />
          </div>
        </div>
        </q-card-section>
        <q-separator inset/>
        <q-card-section>
            <q-btn
              @click="register"
              color="amber"
              outline
              label="Sign Up"/>
            <router-link :to="{ name: 'login' }" class="float-right"  style="text-decoration: none">
              <template>
                <q-btn
                  flat
                  size="md"
                  color="amber"
                  label="Already a member?"/>
              </template>
            </router-link>
        </q-card-section>
    </q-card>
  </q-page>
</template>

<script>

import { fieldValidationMixin } from 'pages/mixins/fieldValidation'
import { Dialogs } from 'pages/mixins/dialogs'
import PrefixUrlField from 'components/fields/PrefixUrlField.vue'
import EmailField from 'components/fields/EmailField.vue'
import ChangeConnectionElement from 'components/elements/ChangeConnectionElement.vue'

export default {
	name: 'Register',
	components: { EmailField, PrefixUrlField, ChangeConnectionElement },
	mixins: [Dialogs, fieldValidationMixin],
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
				await this.$store.dispatch('auth/REGISTER', this.formData)
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
}
</script>

<style>
  .q-field__bottom {
    padding: 3px 5px;
  }

  .q-field__messages {
    line-height: 1.25;
  }
</style>
