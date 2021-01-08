<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card dark flat bordered class="q-dialog-plugin bg-secondary">
      <q-card-section>
        <q-input
          dark
          @input="inputHost($event)"
          :value="formData.host"
          :rules="[isValidHost]"
          label="Host"
          label-color="amber"
          :error="isValid('formErrors', 'host')"
          :error-message="formErrors.host"
        />
      </q-card-section>
      <q-card-actions vertical>
        <q-btn
          outline
          color="amber"
          label="Update connection"
          @click="onOKClick"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { fieldValidationMixin } from 'pages/mixins/fieldValidation'

export default {
  name: 'ConnectionEditDialog',
  mixins: [fieldValidationMixin],
  data () {
    return {
      formData: {
        host: this.$store.getters['connection/HOST']
      },
      formErrors: {
        host: ''
      }
    }
  },
  methods: {
    show () {
      this.$refs.dialog.show()
    },

    hide () {
      this.$refs.dialog.hide()
    },

    onDialogHide () {
      this.$emit('hide')
    },

    onOKClick () {
      try {
        this.$store.dispatch('connection/UPDATE_HOST', this.formData.host)
        this.$emit('ok', this.formData)
        this.hide()
      } catch (e) {
        e.setErrors(this.formErrors)
      }
    },

    inputHost ($event) {
      this.dropErrors()
      this.formData.host = $event
    },

    dropErrors () {
      this.formErrors.host = ''
    },

    onCancelClick () {
      this.hide()
    }
  }
}
</script>
