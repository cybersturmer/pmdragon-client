<template>
  <q-page class="flex flex-center">
    <q-card
      v-if="isRegistration"
      dark
      flat
      bordered
      class="my-card" style="width: 320px">
      <q-card-section>
        <div class="text-h6">Complete your registration</div>
      </q-card-section>
      <q-card-section>
        <PasswordField
          v-model="formData.password"
          :error-message="formErrors.password"
          @keyup.enter.native="completeRegistration"
        />
      </q-card-section>
      <q-card-actions vertical>
        <q-btn
          dark
          outline
          @click="completeRegistration"
        >
          Complete
        </q-btn>
      </q-card-actions>
    </q-card>
    <q-card
      v-else
      dark
      flat
      bordered
      class="my-card">
      <q-card-section class="text-center">
        <div class="text-h6">Your registration was not found.</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import PasswordField from 'components/fields/PasswordField'
import { Dialogs } from 'pages/mixins/dialogs'
import { fieldValidationMixin } from 'pages/mixins/fieldValidation'

export default {
  name: 'VerifyPasswordRestore',
  mixins: [Dialogs, fieldValidationMixin],
  components: { PasswordField },
  data () {
    return {
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
    /**
     * @todo Let's implement this
     * Let's get data from request
     * like email and person id */
  },
  methods: {
    async passwordRestore () {
      /**
       * @todo Let's implement this
       * We have to send:
       * 1) Token to verify that it's me
       * 2) New password
       * 3) One more time new password
       * As a result we have to change password for user
       * */

    }
  }
}
</script>
