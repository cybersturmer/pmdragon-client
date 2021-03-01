<template>
  <q-page class="q-pa-lg">
    <q-stepper
      v-model="step"
      vertical
      ref="stepper"
      dark
      inactive-color="amber"
      active-color="amber"
      done-color="positive"
      animated
    >
      <q-step
        :name="1"
        :done="isUserStepDone"
        done-color="positive"
        title="Some bytes about you"
        icon="mdi-face-recognition"
      >
        <q-input
          v-model="userFormData.first_name"
          dark
          dense
          square
          filled
          type="text"
          label="First name"
          :error="isValid('userFormErrors', 'first_name')"
          :error-message="userFormErrors.first_name"
          class="q-mb-sm"
          standout="text-white bg-primary"
        />
        <q-input
          v-model="userFormData.last_name"
          dark
          dense
          square
          filled
          type="text"
          label="Last name"
          :error="isValid('userFormErrors', 'last_name')"
          :error-message="userFormErrors.last_name"
          class="q-mb-sm"
          standout="text-white bg-primary"
        />
        <q-input
          v-model="userFormData.username"
          dark
          dense
          square
          filled
          type="text"
          label="Username"
          :error="isValid('userFormErrors', 'username')"
          :error-message="userFormErrors.username"
          hint="Better to use short username, not email"
          standout="text-white bg-primary"
        />
      </q-step>
      <q-step
        :name="2"
        title="Congratulations"
        done-color="positive"
        icon="mdi-thumb-up"
      >
        <q-card dark flat>
          Congratulations, now you can work in you workspace.
        </q-card>
      </q-step>
      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            @click="continueClick($refs)"
            outline
            :label="nextLabel"
          />
          <q-btn
            v-if="step > 1"
            flat
            @click="$refs.stepper.previous()"
            label="Back" />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </q-page>
</template>

<script>

import { fieldValidationMixin } from 'pages/mixins/fieldValidation'
import { Dialogs } from 'pages/mixins/dialogs'

export default {
  name: 'Kickstart',
  mixins: [fieldValidationMixin, Dialogs],
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
    workspace () {
      return this.$store.getters['auth/WORKSPACE_FIRST_PREFIX']
    },
    isUserDataFilled () {
      /** If user data filled we return true **/
      const isFirstName = !!this.$store.getters['auth/MY_FIRST_NAME']
      const isLastName = !!this.$store.getters['auth/MY_LAST_NAME']
      const isUsername = !!this.$store.getters['auth/MY_USERNAME']

      return isFirstName && isLastName && isUsername
    },
    nextLabel () {
      return this.step === 2 ? 'Finish' : 'Continue'
    }
  },
  methods: {
    async continueClick ($refs) {
      try {
        switch (this.step) {
          case 1:
            await this.updateUserData()
            break
          case 2:
            await this.$router.push({ name: 'loading' })
            break
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
      await this.$store.dispatch('auth/UPDATE_MY_DATA', this.userFormData)
      this.isUserStepDone = true
    },
    getInitStep () {
      return 1
    }
  }
}
</script>
