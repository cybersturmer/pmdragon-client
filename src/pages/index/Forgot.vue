<template>
  <q-page class="flex flex-center">
    <ChangeConnectionElement/>
        <q-card dark flat bordered class="my-card" style="width: 320px">
          <q-card-section class="q-pa-md">
              <EmailField v-model="formData.email" :error-message="formErrors.email"/>
          </q-card-section>
          <q-card-actions vertical>
            <q-btn
              outline
              color="amber"
              label="Send reset email"
              @click="reset"
            />
          </q-card-actions>
        </q-card>
  </q-page>
</template>

<script>
import { fieldValidationMixin } from 'pages/mixins/fieldValidation'
import { Dialogs } from 'pages/mixins/dialogs'
import ChangeConnectionElement from 'src/components/elements/ChangeConnectionElement'
import EmailField from 'components/fields/EmailField'

export default {
	name: 'Login',
	components: { EmailField, ChangeConnectionElement },
	mixins: [Dialogs, fieldValidationMixin],
	data () {
		return {
			formData: {
				email: ''
			},
			formErrors: {
				email: ''
			}
		}
	},
	methods: {
		async reset () {
			try {
				const payload = {
					email: this.formData.email
				}

				await this.$store.dispatch('auth/FORGOT_PASSWORD', payload)
				this.showOkDialog(
					'Password successfully reset',
					'Password successfully reset, please follow link in email'
				)
					.onOk(() => this.$router.push({ name: 'login' }))
			} catch (e) {
				this.showError(e)
			}
		}
	}
}
</script>

<style>
  .q-field__messages {
    line-height: 1.25;
  }
  .q-field__bottom {
    padding: 5px 0;
  }
</style>
