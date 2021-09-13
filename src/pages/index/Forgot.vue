<template>
  <q-page class="flex flex-center">
    <ChangeConnectionElement/>
        <q-card flat bordered class="my-card" style="width: 320px">
          <q-card-section class="q-pa-md">
              <EmailField v-model="formData.email" :error-message="formErrors.email"/>
          </q-card-section>
					<q-card-section class="row q-pt-none justify-between">
						<div class="col-5">
							<q-btn
								outline
								label="Reset"
								@click="reset"/>
						</div>
						<div class="col-4">
							<router-link :to="{ name: 'login' }" v-slot="{ navigate }">
								<q-btn
									flat
									color="secondary"
									label="Cancel"
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
import { fieldValidationMixin } from 'pages/mixins/fieldValidation'
import { AuthActionsMixin } from 'src/services/actions/auth'
import { Dialogs } from 'pages/mixins/dialogs'
import ChangeConnectionElement from 'components/elements/GeneralSettingsElement'
import EmailField from 'components/fields/EmailField'

export default defineComponent({
	name: 'Login',
	components: { EmailField, ChangeConnectionElement },
	mixins: [
		Dialogs,
		fieldValidationMixin,
		AuthActionsMixin
	],
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

				await this.addPersonPasswordForgotRequest(payload)
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
})
</script>

<style>
  .q-field__messages {
    line-height: 1.25;
  }
  .q-field__bottom {
    padding: 5px 0;
  }
</style>
