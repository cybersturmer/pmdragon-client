<template>
  <q-page class="flex flex-center">
    <ChangeConnectionElement/>
        <q-card dark flat bordered class="my-card" style="width: 320px">
          <q-card-section class="q-pa-md">
            <div class="column">
              <div class="col">
                <UsernameField
                  v-model="formData.username"
                  :error-message="formErrors.username"
                />
              </div>
              <div class="col">
                <PasswordField
                  v-model="formData.password"
                  :error-message="formErrors.password"
                  @keyup.enter.native="login"
                />
              </div>
            </div>
          </q-card-section>
          <q-separator dark inset/>
          <q-card-section>
            <q-btn
              outline
              color="amber"
              label="Sign In"
              @click="login"
            />
            <router-link :to="{ name: 'register' }" class="float-right" style="text-decoration: none">
              <template>
              <q-btn
                flat
                size='md'
                color="amber"
                label="Want to register?"
                style="margin-left: 30px"/>
              </template>
            </router-link>
            <!-- @todo I think better to do here a dialog to restore password -->
          </q-card-section>
        </q-card>
  </q-page>
</template>

<script>
import { fieldValidationMixin } from 'pages/mixins/fieldValidation'
import { ErrorHandler } from 'src/services/util'
import { Dialogs } from 'pages/mixins/dialogs'
import PasswordField from 'components/fields/PasswordField'
import UsernameField from 'components/fields/UsernameField'
import ChangeConnectionElement from 'components/elements/ChangeConnectionElement'

export default {
  name: 'Login',
  components: { UsernameField, PasswordField, ChangeConnectionElement },
  mixins: [Dialogs, fieldValidationMixin],
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
  methods: {
    async login () {
      try {
        await this.$store.dispatch('current/RESET')
        await this.$store.dispatch('auth/RESET')
        await this.$store.dispatch('core/RESET')

        await this.$store.dispatch('auth/LOGIN', this.formData)

        this.$set(this.formData, 'username', '')
        this.$set(this.formData, 'password', '')

        await this.$router.push({ name: 'loading' })
      } catch (e) {
        const error = new ErrorHandler(e)
        this.showOkDialog('Login was not successful', error.message)
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
