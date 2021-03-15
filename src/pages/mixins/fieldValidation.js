export const fieldValidationMixin = {
  methods: {
    isValid (module, field) {
      try {
        return this[module][field].length > 0
      } catch (e) {
        return false
      }
    },
    isFieldValid (module, field) {
      return this[module][field].length > 0
    },
    resetFieldErrorMessage (module, field) {
      this[module][field] = ''
    },
    resetFieldsErrorMessages (module, fields) {
      for (const field of fields) {
        this.resetFieldErrorMessage(module, field)
      }
    },
    isValidEmail (emailString) {
      /** We Do not check empty value by regular expression */
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
      return !emailString || emailPattern.test(emailString) || 'Should be a valid Email'
    },
    isValidHost (str) {
      /** For host we can use
       * ONLY https due secure reason
       * Domain name such as localhost or pmdragon.org or any other valid
       * Or even IP address
       * SPECIFIC PORT example https://pmdragon.org:8080
       * We Do not check empty value by regular expression
       * **/
      const pattern = new RegExp(
        '^((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // Domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))|' + // Or IPv4 address
        '(localhost)' + // Or localhost
        '(\\:\\d+)?$', // Specific Port
        'i')
      return !str || !!pattern.test(str) || 'Should be a valid Host without protocol, example: pmdragon.org'
    },
    isValidWorkspacePrefix (str) {
      /** We Do not check empty value by regular expression */
      const pattern = new RegExp(
        '^[a-zA-Z0-9]{3,20}$'
      )
      return !str || !!pattern.test(str) || 'Should be a valid url from 3 to 20 letters example: pmdragon'
    }
  }
}
