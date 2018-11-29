import Vue from 'vue'
import spanish from 'vee-validate/dist/locale/es'
import VeeValidate, { Validator } from 'vee-validate'

Validator.localize('es', spanish)

const config = {
  errorBagName: 'formErrors', // change if property conflicts
  fieldsBagName: 'fields',
  delay: 0,
  events: 'input|blur',
  inject: false,
  validity: false,
  aria: true
}

Vue.use(VeeValidate, config)
