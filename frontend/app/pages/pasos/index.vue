<template>
  <v-layout align-center justify-center pa-1>
    <v-flex xs12 sm10 md9 lg6 xl5>
      <v-form v-model="valid" row lazy-validation ref="form">
      <v-stepper v-model="currentStep" class="stepper">
        <v-stepper-header class="stepper__header">
          <v-stepper-step class="stepper__step"
            v-for="(stepper, index) in stepData" 
            :key="`${index}-step`" 
            :step="index + 1" 
            :complete="currentStep > (index + 1)"
            >
            {{stepper.stepLabel}}
          </v-stepper-step>
          <v-divider :key="index" class="divider"></v-divider>
        </v-stepper-header>
        <v-stepper-items>
          
          <v-stepper-content step="1">
            <v-form ref="formStep1form">
            <v-flex xs12>
              <v-card>
                <v-card-title class="subheading mt-3 pa-1 primary--text">Cargue su información personal</v-card-title>
                <v-card-text class="mb-3 pa-0">
                    <v-layout row wrap>
                      <v-flex xs6 md6 px-1>
                        <v-text-field label="Nombre" placeholder="" v-model="name" :rules="nameRules" required></v-text-field>
                      </v-flex>
                      <v-flex xs6 md6 px-1>
                        <v-text-field label="Apellido" placeholder="" v-model="last_name" :rules="lastNameRules" required></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                      <v-flex xs12 md12>
                        <v-layout row wrap>
                          <v-flex xs3 md2 px-1>
                            <v-text-field label="Cód. de area" placeholder="" :persistent-hint="true"  v-model="area_code"  :rules="codeareaRules" required></v-text-field>
                          </v-flex>
                          <v-flex xs9 md4 px-1>
                            <v-text-field label="Número de teléfono celular" :persistent-hint="true" hint="Ingrese celular sin el 15 ej.(5919-6845)" placeholder="" v-model="phone" :mask="phoneMask" :rules="phoneRules" required></v-text-field>
                          </v-flex>
                          <v-flex xs12 md6 px-1>
                            <v-checkbox label="Contactarme por WhatsApp" v-model="contact_ws" color="primary"></v-checkbox>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                </v-card-text>
                <v-card-title class="subheading mt-3 pa-1 md-12 secondary--text">Ingrese su número de cuit o cuil</v-card-title>
                <v-card-text class="mb-3 pa-0">
                    <v-layout row wrap>
                      <v-flex xs12 md12 px-1>
                        <v-text-field :counter="11" label="Ingrese su cuit/cuil" :mask="cuitMask" :rules="cuitRules" v-model="cuit_cuil" required>
                        </v-text-field>
                      </v-flex>
                    </v-layout>
                </v-card-text>
                <v-card-title class="subheading mt-3 pa-1 secondary--text">Dirección del inmueble a alquilar</v-card-title>
                <v-card-text class="mb-3 pa-0">
                    <v-layout row wrap>
                      <v-flex xs6 md6 px-1>
                        <v-text-field label="Calle" v-model="address_street" :rules="streetRules" required></v-text-field>
                      </v-flex>
                      <v-flex xs6 md2 px-1>
                        <v-text-field label="Número" v-model="address_number" :rules="numberRules" required></v-text-field>
                      </v-flex>
                      <v-flex xs6 md2 px-1>
                        <v-text-field label="Piso" v-model="address_floor"></v-text-field>
                      </v-flex>
                      <v-flex xs6 md2 px-1>
                        <v-text-field label="Depto" v-model="address_apartment"></v-text-field>
                      </v-flex>
                      <v-flex xs12 md4 px-1>
                        <v-autocomplete
                          :items="places"
                          v-model="state"
                          label="Provincia"
                          item-text="name"
                          item-value="name"
                          
                          >
                        </v-autocomplete>
                      </v-flex>
                      <v-flex xs12 md4 px-1>
                        <v-autocomplete 
                          :items="cities" 
                          v-model="city" 
                          label="Ciudad/Localidad" 
                          :disabled="cities.length == 0"
                          
                          >
                        </v-autocomplete>
                      </v-flex>
                      <v-flex xs12 md4 px-1>
                        <v-text-field label="Código Postal" v-model="postal_code" :rules="cpRules" required></v-text-field>
                      </v-flex>
                    </v-layout>
                </v-card-text>
                
                <v-card-text class="mb-3 pa-0">
                  <v-layout row wrap class="dark--text">
                    <v-flex xs6>Soy una persona políticamente expuesta.</v-flex>
                  </v-layout>
                  <v-radio-group v-model="political_person" row>
                    <v-radio label="No" value="no"></v-radio>
                    <v-radio label="Si" value="si"></v-radio>
                  </v-radio-group>
                </v-card-text>
                
                <div v-if="mq === 'desktop'">
                  <v-divider></v-divider>
                  <v-card-actions class="px-0">
                    <v-layout row wrap class="mb-2 mt-4 mx-0">
                      <v-spacer></v-spacer>
                      <v-flex xs12 px-0 text-xs-right>
                        <v-btn outline color="secondary" nuxt @click="nextStep" :disabled="!(currentStep < stepData.length)">Siguiente</v-btn>
                      </v-flex>
                      <v-spacer></v-spacer>
                    </v-layout>
                  </v-card-actions>
                </div>
                
              </v-card>
            </v-flex>
           <v-form>
          </v-stepper-content>
          
          <v-stepper-content step="2">
            <v-flex xs12>
              <v-card>
                <v-card-title class="subheading mt-3 pa-1 primary--text">Complete sus datos laborales</v-card-title>
                <v-card-text class="mb-3 pa-0">
                    <v-form ref="formStep2Radios">
                      <v-layout row>
                        <v-radio-group hide-details v-model="worker_type" :rules="workerTypeRules" required>
                          <v-radio label="Relación de dependencia" hide-details value="Relación de dependencia" color="primary" class="mb-2" @change="checkChange"></v-radio>
                          <v-radio label="Monotributista" hide-details value="Monotributista" color="primary" class="mb-2" @change="checkChange"></v-radio>
                          <v-radio label="Responsable Inscripto/a o Autónomo/a" value="Responsable Inscripto/a o Autónomo/a" hide-details color="primary" class="mb-2" @change="checkChange"></v-radio>
                        </v-radio-group>
                      </v-layout>
                    </v-form>
                  <p class="mb-3 px-1 mt-3" v-if="activeCheck === 'Monotributista' || activeCheck === 'Responsable Inscripto/a o Autónomo/a'">
                    <strong class="secondary--text">Para continuar con el procesamiento de su póliza nos pondremos en contacto con Ud.</strong> <br>También puede contactarnos telefónicamente al 5217-0900
                  </p>
                </v-card-text>
                <div v-if="activeCheck === 'Relación de dependencia'">
                  <v-form ref="formStep2form">
                  <v-card-text class="mb-3 pa-0">
                      <v-layout row wrap>
                        <v-flex xs12 md4 px-1>
                          <v-text-field prefix="$" placeholder="" label="Sueldo bruto" type="text" v-model="salary" :rules="salaryRules" required></v-text-field>
                        </v-flex>
                        <v-flex xs12 md4 px-1>
                          <v-select :items="antiguedad" v-model="antiquity" label="Años de antiguedad"></v-select>
                        </v-flex>
                      </v-layout>
                  </v-card-text>
                  <v-layout row wrap>
                    <v-flex xs12 md12>
                      <v-card-title class="subheading pa-1 secondary--text">Documentación Solicitada</v-card-title>
                      <v-card-title class="caption mb-4 pa-1">Debe adjuntar los siguientes archivos en formato Microsoft Word, PDF, JPG o PNG.<br>
                      Cada archivos no pueden pesar más de 5MB.</v-card-title>
                      <v-card-text class="mb-3 pa-0">
                          <v-layout row wrap>
                            <v-flex xs12 md12 mb-4>
                              <ul class="caption mb-2 px-1">
                                <li>1. Ultimos 3 recibos de sueldo</li>
                                <li>2. DNI (Frente y dorso)</li>
                                <li>3. Contrato de alquiler o precontrato</li>
                              </ul>
                              <UploadFilesDragDrop/>
                            </v-flex>
                          </v-layout>
                      </v-card-text>
                    </v-flex>
                  </v-layout>
                  <v-form>
                </div>
                
                <div v-if="mq === 'desktop'">
                  <v-divider></v-divider>
                  <v-card-actions class="px-0">
                    <v-layout row wrap class="mb-2 mt-4 mx-0">
                      <v-spacer></v-spacer>
                      <v-flex xs12 px-0 text-xs-right>
                        <v-btn outline color="secondary" nuxt @click="prevStep">Anterior</v-btn>
                        <v-btn outline color="secondary" nuxt @click="nextStep" v-if="worker_type === 'Relación de dependencia'" :disabled="!(currentStep < stepData.length)">Siguiente</v-btn>
                        <v-btn outline color="secondary" nuxt @click="submit" v-else :disabled="!valid">Enviar Solicitud</v-btn>
                      </v-flex>
                      <v-spacer></v-spacer>
                    </v-layout>
                  </v-card-actions>
                </div>
                
              </v-card>
            </v-flex>
          </v-stepper-content>
          
          <v-stepper-content step="3">
            <v-flex xs12>
              <v-card>
                <v-card-title class="subheading pa-1 primary--text">Datos del alquiler</v-card-title>
                <v-card-text class="mb-3 pa-0">
                    <v-layout row wrap>
                      <v-flex xs12 md4 px-1>
                        <v-select :items="moneda" v-model="currency" label="Moneda" :rules="currencyRules" required></v-select>
                      </v-flex>
                      <v-flex xs12 md4 px-1>
                        <v-select :items="duracion" v-model="contract_period" label="Duración del contrato" :rules="contractPeriodRules" required></v-select>
                      </v-flex>
                      <v-flex xs12 md4 px-1>
                        <v-text-field prefix="$" placeholder="" label="Importe del primer mes" type="text" v-model="first_month_amount" :rules="priceRules" required ></v-text-field>
                      </v-flex>
                    </v-layout>
                </v-card-text>
                <v-layout row wrap>
                  <v-flex xs12 md12>
                    <v-card-title class="subheading pa-1 secondary--text">¿Desea incluir expensas?</v-card-title>
                    <v-card-text class="mb-3 pa-0 ">
                        <v-layout align-center>
                          <v-checkbox v-model="expensesEnabled" hide-details class="shrink mr-2"></v-checkbox>
                          <v-text-field prefix="$" placeholder="" label="Monto mensual de las expensas" v-model="expenses" type="text" :disabled="!expensesEnabled"></v-text-field>
                        </v-layout>
                    </v-card-text>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs12 md6>
                    <v-card-title class="subheading pa-1 secondary--text">Monto total del contrato</v-card-title>
                    <v-card-text class="mb-3 pa-0">
                        <v-layout row wrap>
                          <v-flex xs12 md12 px-1>
                            <v-text-field prefix="$" placeholder="" label="Ingrese el monto total del contrato" type="text" v-model="total_amount" :rules="contractRules" required></v-text-field>
                          </v-flex>
                        </v-layout>
                    </v-card-text>
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-card-title class="subheading pa-1 secondary--text">Monto total del contrato + expensas</v-card-title>
                    <v-card-text class="mb-3 pa-0">
                        <v-layout row wrap>
                          <v-flex xs12 md12 px-1>
                            <v-text-field prefix="$" placeholder="" type="text" v-model="total_amount_expenses" disabled></v-text-field>
                          </v-flex>
                        </v-layout>
                    </v-card-text>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs12 md12 v-if="rental_policy > 0">
                    <v-card-title class="subheading pa-1 secondary--text">Costo de la póliza de alquiler</v-card-title>
                    <p class="title total green--text " v-model="rental_policy">${{ rental_policy }}</p>
                  </v-flex>
                  <v-flex row wrap xs12 md12 px-1>
                    <v-card-text class="mb-3 pa-0 mt-5">
                      <span class="pl-2" class="terms">Acepto los <a :href="headLess.acf.terminos_y_condiciones.url" download target="_blank">Términos y condiciones de contratación</a></span>
                      <v-checkbox v-model="terms" color="primary mt-2" :rules="termsRules" required></v-checkbox>
                    </v-card-text>
                  </v-flex>
                </v-layout>
                <v-divider></v-divider>
                <v-card-actions class="px-0">
                  <v-layout row wrap class="mb-2 mt-4 mx-0">
                    <v-spacer></v-spacer>
                    <v-flex xs12 px-0 text-xs-right>
                      <v-btn outline color="secondary" nuxt @click="prevStep" v-if="mq === 'desktop'">Anterior</v-btn>
                      <v-btn outline color="primary" nuxt @click="submit" :disabled="!valid">Enviar Solicitud</v-btn>
                    </v-flex>
                    <v-spacer></v-spacer>
                  </v-layout>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-stepper-content>
          
        </v-stepper-items>
      </v-stepper>
      </v-form>
      
      <v-bottom-nav fixed :value="true" v-if="mq === 'mobile'" class="bottom-nav">
        <v-btn color="white" @click="prevStep" v-scroll-to="'.interface'" :disabled="currentStep  <= 1">
          <v-icon large>keyboard_arrow_left</v-icon>
        </v-btn>
        <v-btn>
          <v-progress-circular :size="45" :width="3" :rotate="-90" :value="valueProgress" color="white">
          </v-progress-circular>
        </v-btn>
        <v-btn color="white" @click="nextStep" v-scroll-to="'.interface'" :disabled="!(currentStep < stepData.length)">
          <v-icon large>keyboard_arrow_right</v-icon>
        </v-btn>
      </v-bottom-nav>
      
      
    </v-flex>
  </v-layout>
</template>


<script>
  import Cookie from 'js-cookie'
  import UploadFilesDragDrop from '~/components/UploadFilesDragDrop'
  import places from '~/static/places.json'
  import status from '~/static/status.json'

  function isNumber (n) {
    return !isNaN(parseFloat(n)) && isFinite(n)
  }

  export default {
    middleware: 'authenticated',
    async asyncData ({ app, store, params }) {
      let page = await app.$axios.get(`wp/v2/pages?slug=index&_embed`)
      store.commit('setPage', page.data[0])
      store.commit('setObjectForSeo', page.data[0])
    },
    layout (context) {
      return 'vuetify'
    },
    components: {
      UploadFilesDragDrop
    },
    data: () => ({
      activeCheck: '',
      stepData: [
        { stepLabel: 'Información Personal' },
        { stepLabel: 'Información laboral' },
        { stepLabel: 'Datos del alquiler' }
      ],
      valid: true,
      expensesEnabled: false,
      currentStep: 0,
      total_amount: '',
      value: '',
      contact_ws: false,
      political_person: 'no',

      // RULES
      name: '',
      nameRules: [
        v => !!v || 'Su nombre es requerido'
      ],
      last_name: '',
      lastNameRules: [
        v => !!v || 'Su apellido es requerido'
      ],
      phone: '',
      phoneMask: '####-####',
      phoneRules: [
        v => !!v || 'El número de teléfono es requerido',
        v => v.length === 8 || 'El teléfono debe tener 8 números'
      ],
      area_code: '',
      codeareaRules: [
        v => !!v || 'El código de area es requerido'
      ],
      cuit_cuil: '',
      cuitMask: '##-########-#',
      cuitRules: [
        v => !!v || 'El cuit es requerido',
        v => v.length === 11 || 'El cuit debe tener 11 números'
      ],
      address_street: '',
      streetRules: [
        v => !!v || 'La calle es requerida'
      ],
      address_number: '',
      numberRules: [
        v => !!v || 'La altura es requerida'
      ],
      postal_code: '',
      cpRules: [
        v => !!v || 'El código postal es requerido'
      ],
      workerTypeRules: [
        v => !!v || 'El tipo de trabajo es requerido'
      ],

      currencyRules: [
        v => !!v || 'La moneda es requerida'
      ],
      contractPeriodRules: [
        v => !!v || 'La dureción del contrato es requerida'
      ],

      salary: '',
      salaryRules: [
        v => !!v || 'Su sueldo es requerido'
      ],
      expenses: '',
      antiquity: '',
      antiguedad: [{
        text: '1 año',
        value: 12
      },
      {
        text: '2 años',
        value: 24
      },
      {
        text: '3 años',
        value: 36
      },
      {
        text: '4 años',
        value: 48
      },
      {
        text: '5 años',
        value: 60
      },
      {
        text: 'Más de 5 años',
        value: 60
      }
      ],
      first_month_amount: '',
      priceRules: [
        v => !!v || 'El importe es requerido'
      ],
      contractRules: [
        v => !!v || 'El monto de contrato es requerido'
      ],

      generalRules: [
        v => !!v || 'Campo requerido'
      ],

      states: [],
      cities: [],
      state: '',
      city: 'Palermo',
      places: places,

      moneda: [
        'Pesos Argentinos', 'Dólares', 'Euros'
      ],
      contract_period: 0,
      duracion: [{
        text: '1 año',
        value: 12
      },
      {
        text: '2 años',
        value: 24
      },
      {
        text: '3 años',
        value: 36
      }
      ],

      address_floor: '',
      address_apartment: '',
      payslips: '',
      dni: '',
      rental_contract: '',
      status: status[1].code,
  
      terms: false,
      termsRules: [
        v => !!v || 'Debes aceptar los Términos y condiciones de contratación'
      ]
    }),
    computed: {
      total_amount_expenses () {
        let expensesValue = 0
        if (isNumber(this.expenses) && this.expensesEnabled) expensesValue = Number(this.expenses)
        if (isNumber(this.total_amount) && this.contract_period !== 0) {
          return ((expensesValue * this.contract_period) + Number(this.total_amount))
        }
        return ''
      },
      rental_policy () {
        if (isNumber(this.total_amount_expenses) && this.contract_period !== 0) {
          return ((this.total_amount_expenses / this.contract_period) * 1.5).toFixed(2)
        }
        return ''
      },
      page () {
        return this.$store.state.page
      },
      headLess () {
        return this.$store.state.headLess
      },
      valueProgress () {
        if (this.currentStep <= 1) return 0
        return (this.currentStep - 1) / this.stepData.length * 100
      }
    },
    mounted () {
      // console.log(this.$vuetify.breakpoint)
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          this.mq = 'mobile'
          break
        case 'sm':
          this.mq = 'mobile'
          break
        case 'md':
          this.mq = 'desktop'
          break
        case 'lg':
          this.mq = 'desktop'
          break
        case 'xl':
          this.mq = 'desktop'
          break
      }

      if (this.$store.state.auth.user.status !== 'false') {
        const storeFormData = this.$store.state.auth
        this.$axios.get(process.env.FRONTEND_DOMAIN + '/api/user-by-email/' + storeFormData.user.email)
          .then((response) => {
            this.name = response.data.user.name
            this.last_name = response.data.user.last_name
            this.area_code = response.data.user.area_code
            this.phone = response.data.user.phone
            this.contact_ws = response.data.user.contact_ws
            this.cuit_cuil = response.data.user.cuit_cuil
            this.address_street = response.data.user.address_street
            this.address_number = response.data.user.address_number
            this.address_floor = response.data.user.address_floor
            this.address_apartment = response.data.user.address_apartment
            this.state = response.data.user.state
            this.city = response.data.user.city
            this.postal_code = response.data.user.postal_code
            if (!response.data.user.political_person) {
              this.political_person = 'no'
            } else {
              this.political_person = response.data.user.political_person
            }

            this.worker_type = response.data.user.worker_type
            this.workerTypeRules = true
            this.salary = response.data.user.salary
            this.antiquity = response.data.user.antiquity
            if (response.data.user.documentation) {
              this.documentation = response.data.user.documentation
              this.$store.commit('setFormUploadFiles', JSON.parse(this.documentation))
            }

            this.currency = response.data.user.currency
            this.contract_period = response.data.user.contract_period
            this.first_month_amount = response.data.user.first_month_amount
            if (response.data.user.expenses) {
              this.expensesEnabled = true
              this.expenses = response.data.user.expenses
            }
            this.total_amount = response.data.user.total_amount
            this.total_amount_expenses = response.data.user.total_amount_expenses
            this.rental_policy = response.data.user.rental_policy
            this.fee_income = response.data.user.fee_income

            this.status = response.data.user.status
            this.nosis = response.data.user.nosis

            this.activeCheck = response.data.user.worker_type

            this.terms = true
            this.termsRules = true
          })
      }
    },
    head () {
      return {
        title: `${this.$store.state.meta.name}`
      }
    },
    methods: {
      checkChange: function (val) {
        this.activeCheck = val
      },
      prevStep: function () {
        this.currentStep = this.currentStep - 1
      },
      nextStep: function () {
        switch (this.currentStep) {
          case 1:
            if (this.$refs.formStep1form.validate()) {
              this.currentStep = this.currentStep + 1
            }
            break
          case 2:
            if (this.activeCheck === '' && this.$refs.formStep2Radios.validate()) {} else if (this.activeCheck === 'Relación de dependencia' && this.$refs.formStep2form.validate()) {
              this.currentStep = this.currentStep + 1
            } else if (this.activeCheck === 'Monotributista' || this.activeCheck === 'Responsable Inscripto/a o Autónomo/a') {
              this.currentStep = this.currentStep + 1
            }
            break
        }
      },
      submit: function () {
        if (this.$refs.form.validate()) {
          this.valid = false
          let formData = {

            email: this.$store.state.auth.user.email,

            name: this.name,
            last_name: this.last_name,
            area_code: this.area_code,
            phone: this.phone,
            contact_ws: this.contact_ws,
            cuit_cuil: this.cuit_cuil,
            address_street: this.address_street,
            address_number: this.address_number,
            address_floor: this.address_floor,
            address_apartment: this.address_apartment,
            state: this.state,
            city: this.city,
            postal_code: this.postal_code,
            political_person: this.political_person,

            worker_type: this.worker_type,
            salary: this.salary,
            antiquity: this.antiquity,
            documentation: JSON.stringify(this.$store.state.formUploadFiles),

            currency: this.currency,
            contract_period: this.contract_period,
            first_month_amount: this.first_month_amount,
            expenses: this.expenses,
            total_amount: this.total_amount,
            total_amount_expenses: this.total_amount_expenses,
            rental_policy: this.rental_policy,
            fee_income: 32,

            status: this.status
          }

          let formDataURI = Object.keys(formData).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(formData[key])
          }).join('&')

          let config = {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          }

          this.$axios.post(process.env.FRONTEND_DOMAIN + '/api/formdata', formDataURI, config)
            .then((response) => {
              this.message = response.data.message
              this.alertType = response.data.responseStatus

              // Cada insert actualiza el status en la Cookie
              if (Cookie.get('auth')) {
                let authParsed = JSON.parse(Cookie.get('auth'))
                authParsed.user.status = this.status
                Cookie.set('auth', JSON.stringify(authParsed))
              }

              if (response.data.responseStatus === 'danger') {
                this.$nuxt.$router.replace({ path: '/login' })
              } else if (response.data.responseStatus === 'success') {
                if (formData.worker_type === 'Relación de dependencia') {
                  this.$nuxt.$router.replace({ path: '/informacion-recibida' })
                } else {
                  this.$nuxt.$router.replace({ path: '/informacion-recibida-autonomo' })
                }
              }
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          // console.log('No validado!')
        }
      }
    },
    watch: {
      expensesEnabled: function (val) {
        if (val === false) this.expenses = ''
      },
      terms: function (val) {
        (val === false) ? this.termsRules = [ v => !!v || 'Debes aceptar los Términos y condiciones de contratación' ] : this.termsRules = true
        // console.log(this.termsRules)
      },
      state: function (name) {
        this.cities = []
        if (this.city === '') {
          this.city = ''
        }
        let index = this.places.findIndex(x => x.name === name)
        // console.log(index)
        // console.log(name)
        // console.log(this.places[index].childs)
        this.cities = this.places[index].childs
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~assets/css/vars.scss';
  .el-upload-dragger {
    width: 340px;
  }

  .stepper {
    margin-bottom: 71px;
  }

  .stepper__header {
    .divider {
      background: rgba(0, 0, 0, .12);
      position: absolute !important;
      left: 0;
      width: 100%;
      margin: 0;
    }
  }

  .stepper__step {
    background: white;
    z-index: 1;
  }

  .bottom-nav {
    left: 0;
    height: 70px!important;
    background: $tertiary;
    box-shadow: 0 3px 34px 0px rgba(0, 0, 0, .5);
    .btn {
      padding-top: 13px;
      filter: none;
      opacity: 1;
    }
  }

  .card {
    box-shadow: none!important;
  }

  .total {
    border: 1px solid green;
    border-radius: 5px;
    padding: 5px;
    display: inline-block;
    margin: 4px;
  }

  .terms {
    position: absolute;
    left: 30px;
    z-index: 1;
    a {
      text-decoration: underline;
      &:hover {
        color: #2f3a77;
      }
    }
  }
</style>
