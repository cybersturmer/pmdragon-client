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
    isValidEmail (emailString) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
      return emailPattern.test(emailString) || 'Should be a valid Email'
    },
    isValidHost (str) {
      /** For host we can use
       * ONLY https due secure reason
       * Domain name such as https://localhost or https://pmdragon.org or any other valid
       * Or even IP address
       * SPECIFIC PORT example https://pmdragon.org:8080
       * **/
      const pattern = new RegExp(
        '^(https?:\\/\\/)?' + // Protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // Domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))|' + // Or IPv4 address
        '(localhost)' + // Or localhost
        '(\\:\\d+)?$', // Specific Port
        'i')
      return !!pattern.test(str) || 'Should be a valid Host example: https://pmdragon.org'
    },
    isValidWorkspacePrefix (str) {
      const pattern = new RegExp(
        '^[a-zA-Z0-9]{3,20}$'
      )
      return !!pattern.test(str) || 'Should be a valid url from 3 to 20 letters example: pmdragon'
    }
  }
}
