<template>
  <v-layout align-center justify-center pa-1>
    <v-flex xs12 sm10 md9 lg6 xl5>
      <v-card-title class="display-2 mt-4 mb-2 white--text">ADMIN</v-card-title>
      <v-card class="pa-3">
        <v-card-text class="mb-3">
          <v-form v-model="valid" row lazy-validation ref="form">
            <v-layout row wrap>
              <v-flex xs12 md6 px-1>
                <v-text-field label="E-mail" :clearable="true" :persistent-hint="true" hint="Ingrese aquí su email" :validate-on-blur="true" v-model="email" :rules="emailRules" required ref="email" autofocus></v-text-field>
              </v-flex>
              <v-flex xs12 md6 px-1>
                <v-text-field label="Contraseña*" :persistent-hint="true" hint="Ingrese aquí su contraseña" :rules="passwordRules" v-model="password" min="8" max="100" :append-icon="p1 ? 'visibility' : 'visibility_off'" @click:append="() => (p1 = !p1)" :type="p1 ? 'password' : 'text'"></v-text-field>
              </v-flex>
              <v-flex xs12 md12 px-12>
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
            <v-flex xs12 text-md-right text-xs-center>
              <v-btn outline color="primary" @click="login" :disabled="!valid" nuxt>Loguearse</v-btn>
            </v-flex>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>



<script>
  import Cookie from 'js-cookie'
  
  export default {
    middleware: 'notAuthenticated',
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
    mounted () {
      // console.log('https://' + process.env.FRONTEND_DOMAIN + '/api/signin')
      // this.checkCookie()
    },
    methods: {
      checkCookie: function () {
        if (Cookie.get('auth')) {
          let authParsed = JSON.parse(Cookie.get('auth'))
          console.log(authParsed.user.email)
        }
      },
      login: function () {
        if (this.$refs.form.validate()) {
          this.valid = false
          let formData = {
            email: this.email,
            password: this.password,
            role: 'admin'
          }
  
          let formDataURI = Object.keys(formData).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(formData[key])
          }).join('&')

          let config = {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          }
  
          this.$axios.post(process.env.FRONTEND_DOMAIN + '/api/signin', formDataURI, config)
            .then((response) => {
              this.message = response.data.message
              this.alertType = response.data.responseStatus
  
              if (response.data.responseStatus === 'danger') {
                this.valid = true
              }

              if (response.data.responseStatus === 'success') {
                // Authorization
                let auth = {
                  accessToken: response.data.token,
                  user: response.data.user
                }
                Cookie.set('auth', auth)
                window.location.href = '/users'
              }
            })
            .catch(error => {
              console.log(error)
            })
        }
      },
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
      setFocus: function (field) {
        (field === 'email') && this.$refs.email.focus()
      },
      clear: function () {
        this.$refs.form.reset()
        this.message = ''
      }
    },
    watch: {
      message: function (val) {
        this.setFocus('email')
        // console.log("message", val)
      }
    }
  }
</script>
