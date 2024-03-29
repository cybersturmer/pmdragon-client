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
									<UsernameField
										v-model="formData.username"
										:error-message="formErrors.username"
										@enter="login"
									/>
								</div>
								<div class="col">
									<PasswordField
										can-be-reset
										v-model="formData.password"
										:error-message="formErrors.password"
										@enter="login"
									/>
								</div>
							</form>
            </div>
          </q-card-section>
          <q-card-section class="row q-pt-none justify-between">
						<div class="col-5">
							<q-btn
								outline
								label="Sign In"
								@click="login"/>
							</div>
						<div class="col-4">
							<router-link
								style="text-decoration: none"
								:to="{ name: 'register' }"
								v-slot="{ navigate }">
								<q-btn
									flat
									color="secondary"
									label="Register?"
									@click="navigate"
								/>
							</router-link>
						</div>
          </q-card-section>
        </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { fieldValidationMixin } from 'pages/mixins/fieldValidation'
import { Dialogs } from 'pages/mixins/dialogs'
import PasswordField from 'components/fields/PasswordField'
import UsernameField from 'components/fields/UsernameField'
import ChangeConnectionElement from 'components/elements/GeneralSettingsElement'
import { AuthActionsMixin } from 'src/services/actions/auth'

export default defineComponent({
	name: 'Login',
	components: { UsernameField, PasswordField, ChangeConnectionElement },
	mixins: [
		Dialogs,
		fieldValidationMixin,
		AuthActionsMixin
	],
	data () {
		return {
			formData: {
				username: '',
				password: ''
			},
			formErrors: {
				username: '',
				password: ''
			}
		}
	},
	mounted () {
		/** If user is already logged in than
		 * If we know workspace - let's move him on  Backlog page
		 * If we don't know workspace - lets move on Workspaces page **/

		const isLoggedIn = this.$store.getters['auth/IS_LOGGED_IN']
		const isWorkspaceDefined = this.$store.getters['current/IS_WORKSPACE']

		if (!isLoggedIn) return false

		if (isWorkspaceDefined) {
			this.$router.push({ name: 'backlog' })
		} else {
			this.$router.push({ name: 'workspaces' })
		}
	},
	methods: {
		async login () {
			try {
				await this.$store.dispatch('current/RESET')
				await this.$store.dispatch('auth/RESET')
				await this.$store.dispatch('core/RESET')

				await this.obtainTokens(this.formData)

				this.$store.commit('connection/ACTIVATE')
				this.$store.commit('current/ACTIVATE')
				this.$store.commit('auth/ACTIVATE')
				this.$store.commit('core/ACTIVATE')

				await this.$router.push({ name: 'loading' })
			} catch (e) {
				return this.showOkDialog('Login was not successful', e.message)
			}
		}
	}
})
</script>
