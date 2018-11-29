<template>
  <v-layout align-center justify-center pa-1>
    <v-flex xs12 sm10 md9 lg6 xl5>
      <v-card-title class="display-2 mt-4 mb-2 white--text">Bienvenido al registro de Crédito y Caución SA</v-card-title>
      <v-card class="pa-3">
        <v-card-text class="mb-3">
          <p class="mb-4">Ingrese su dirección de e-mail y contraseña para quedar registrado en la plataforma y así poder guardar el estado de su formulario, gestionar su pago y descargar su garantía en cualquier momento. <strong>Jamás haremos uso comercial de su información privada
                  ni le enviaremos un email.</strong></p>
          <v-form v-model="valid" row lazy-validation ref="form">
            <v-layout row wrap>
              <v-flex xs12 md6 px-1>
                <v-text-field label="E-mail" :clearable="true" :persistent-hint="true" hint="Ingrese aquí su email" :validate-on-blur="true" v-model="email" :rules="emailRules" required></v-text-field>
              </v-flex>
              <v-flex xs12 md6 px-1>
                <v-text-field label="Contraseña*" :persistent-hint="true" hint="Debe contener mayúsculas, minasculas y números." :rules="passwordRules" v-model="password" min="8" max="100" :append-icon="p1 ? 'visibility' : 'visibility_off'" @click:append-icon-cb="() => (p1 = !p1)"
                  :type="p1 ? 'password' : 'text'"></v-text-field>
              </v-flex>
              <v-flex xs12 md12 px-12 text-md-right text-xs-center>
                <v-alert :class="alertType" :value="true" v-if="message !== ''">
                  {{ message }}
                </v-alert>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-layout row wrap class="mb-4 mt-4">
            <v-spacer></v-spacer>
            <v-flex xs12 md8 px-2 mb-4 text-md-left text-xs-center>
              <small>Al ingresar esta aceptando los <a :href="headLess.acf.terminos_y_condiciones.url" download target="_blank">Términos y condiciones</a></small>
            </v-flex>
            <v-flex xs12 md4 px-2 text-md-right text-xs-center>
              <v-btn outline color="primary" @click="register" :disabled="!valid" nuxt>Registrarse</v-btn>
            </v-flex>
            <!--<v-flex xs12 md4 px-2 text-md-right text-xs-center>-->
            <!--  <v-btn outline color="secondary" nuxt to="/login">Loguearse</v-btn>-->
            <!--</v-flex>-->
            <v-spacer></v-spacer>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    async asyncData ({ app, store, params }) {
      let page = await app.$axios.get(`wp/v2/pages?slug=login&_embed`)
      store.commit('setPage', page.data[0])
      store.commit('setObjectForSeo', page.data[0])
    },
    layout (context) {
      return 'vuetify'
    },
    props: {
      clearable: Boolean,
      persistentHint: Boolean,
      validateOnBlur: Boolean
    },
    data: () => ({
      message: '',
      alertType: '',
      valid: false,
      p1: true,
      password: '',
      passwordRules: [
        v => !!v || 'La contraseña es requerida',
        v => (v && v.length >= 8) || 'La contraseña debe tener al menos 8 caracteres'
      ],
      email: '',
      emailRules: [
        v => !!v || 'Tu email es obligatorios',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Debes ingresar un email válido'
      ],
      checkbox: false
    }),
    computed: {
      page () {
        return this.$store.state.page
      },
      headLess () {
        return this.$store.state.headLess
      }
    },
    head () {
      return {
        title: `${this.$store.state.meta.name}`
      }
    },
    methods: {
      register: function () {
        if (this.$refs.form.validate()) {
          this.valid = false
          let formData = {
            email: this.email,
            password: this.password
          }
  
          let formDataURI = Object.keys(formData).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(formData[key])
          }).join('&')

          let config = {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          }
  
          this.$axios.post(process.env.FRONTEND_DOMAIN + '/api/signup', formDataURI, config)
            .then((response) => {
              this.message = response.data.message
              this.alertType = response.data.responseStatus
  
              if (response.data.responseStatus === 'danger') {
                this.valid = true
              }
  
              if (response.data.responseStatus === 'success') {
                setTimeout(function () {
                  window.location.href = '/login'
                }, 500)
              }
            })
            .catch(error => {
              console.log(error)
            })
        }
      },
      clear () {
        this.$refs.form.reset()
        this.message = ''
      }
    },
    watch: {
      message: function (val) {
        // console.log('message', val)
      }
    }
  }
</script>
