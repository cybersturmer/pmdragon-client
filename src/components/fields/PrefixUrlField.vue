<template>
  <q-input
    dark
    flat
    type="text"
    @input="handleInput"
    :rules="[isValidWorkspacePrefix]"
    :value="value"
    :error="isError"
    :error-message="errorMessage"
    label="Workspace prefix"
    label-color="amber"
  />
</template>

<script>
import { fieldValidationMixin } from 'pages/mixins/fieldValidation'

export default {
  name: 'PrefixUrlField',
  mixins: [fieldValidationMixin],
  props: {
    value: String,
    errorMessage: String
  },
  methods: {
    handleInput (value) {
      this.$emit('input', value)
    }
  },
  computed: {
    isError () {
      try {
        return this.errorMessage.length > 0
      } catch (e) {
        return false
      }
    }
  }
}
</script>
