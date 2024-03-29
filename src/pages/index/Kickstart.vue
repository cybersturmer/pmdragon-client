<template>
  <q-page class="q-pa-lg">
    <q-stepper
      v-model="step"
      vertical
      ref="stepper"
      inactive-color="secondary"
      active-color="secondary"
      done-color="secondary"
      animated>
      <q-step
        :name="1"
        :done="isUserStepDone"
        title="Some bytes about you"
        active-icon="mdi-face-recognition">
        <q-input
          v-model="userFormData.first_name"
          dense
          square
          filled
          type="text"
          label="First name"
          :error="isValid('userFormErrors', 'first_name')"
          :error-message="userFormErrors.first_name"
          class="q-mb-sm"
          standout="text-white bg-primary"/>
        <q-input
          v-model="userFormData.last_name"
          dense
          square
          filled
          type="text"
          label="Last name"
          :error="isValid('userFormErrors', 'last_name')"
          :error-message="userFormErrors.last_name"
          class="q-mb-sm"
          standout="text-white bg-primary"/>
        <q-input
          v-model="userFormData.username"
          dense
          square
          filled
          type="text"
          label="Username"
          :error="isValid('userFormErrors', 'username')"
          :error-message="userFormErrors.username"
          hint="Better to use short username, not email, less than 24 chars"
          standout="text-white bg-primary"/>
      </q-step>
      <q-step
        :name="2"
        title="Congratulations"
        done-color="accent"
        icon="mdi-thumb-up"
        active-icon="mdi-thumb-up"
      >
        <q-card flat class="text-secondary">
          Congratulations, now you can work in you workspace.
        </q-card>
      </q-step>
      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            @click="continueClick($refs)"
            outline
            :label="nextLabel"
            color="secondary"
          />
          <q-btn
            v-if="step > 1"
            flat
            @click="$refs.stepper.previous()"
            color="secondary"
            label="Back" />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { fieldValidationMixin } from 'pages/mixins/fieldValidation'
import { Dialogs } from 'pages/mixins/dialogs'
import { AuthActionsMixin } from 'src/services/actions/auth'

export default defineComponent({
	name: 'Kickstart',
	mixins: [
		AuthActionsMixin,
		fieldValidationMixin,
		Dialogs
	],
	data () {
		return {
			steps: [1, 2],
			step: this.getInitStep(),
			isUserStepDone: false,
			userFormData: {
				first_name: this.$store.getters['auth/MY_FIRST_NAME'],
				last_name: this.$store.getters['auth/MY_LAST_NAME'],
				username: this.$store.getters['auth/MY_USERNAME']
			},
			userFormErrors: {
				first_name: '',
				last_name: '',
				username: ''
			}
		}
	},
	computed: {
		isUserDataFilled () {
			/** If user data filled we return true **/
			return this.$store.getters['auth/IS_MY_DATA_FILLED']
		},
		nextLabel () {
			return this.step === 2 ? 'Finish' : 'Continue'
		},
		isUsernameChanged () {
			return this.userFormData.username !== this.$store.getters['auth/MY_EMAIL']
		}
	},
	methods: {
		async continueClick ($refs) {
			try {
				switch (this.step) {
				case 1:
					if (!this.isUsernameChanged) {
						this.userFormErrors.username = 'Please change username, not equal to email'
						return
					}

					this.resetFieldErrorMessage('userFormErrors', 'username')
					await this.updateUserData()
					break
				case 2:
					return this.$router.push({ name: 'loading' })
				}

				/** If everything was fine - we move further **/
				await $refs.stepper.next()
			} catch (error) {
				switch (this.step) {
				case 1:
					error.setErrors(this.userFormErrors)
					break
				}

				this.showError(error)
			}
		},
		async updateUserData () {
			/** Update user data on server and mark step as done **/
			await this.updateMyPerson(this.userFormData)
			this.isUserStepDone = true
		},
		getInitStep () {
			return 1
		}
	}
})
</script>
