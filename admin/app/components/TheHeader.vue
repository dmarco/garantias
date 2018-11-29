<template>
  <header :class="{ scrolled: scrollPosition > 100}">
    <div>
      <div class="text-xs-center lazy" to="/" @click="homeScrollTop">
        <div class="logo"> <img v-lazy="headLess.acf.logo_de_la_marca.url"></div>
      </div>
      <div id="mobile-toggle" @click.stop="drawer = !drawer" class="menu">
        <div class="hamburguer">
          <span></span> <span></span> <span></span>
        </div>
      </div>
      <v-navigation-drawer temporary v-model="drawer" fixed>
        
        <v-list class="pa-1">
          
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title v-if="!auth">Menú de Usuario</v-list-tile-title>
              <v-list-tile-title v-else-if="auth && !userHasName">Menú de Usuario</v-list-tile-title>
              <v-list-tile-title v-else-if="auth && userHasName">Bienvenido {{ name }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          
        </v-list>
        
        <v-list class="pt-0" dense>
          
          <v-list-tile>
            <v-list-tile-content v-if="!auth">
              <v-btn medium outline color="primary" class="ma-0 mb-1" block nuxt to="/pasos">Solicitar garantía</v-btn>
            </v-list-tile-content>
            <v-list-tile-content v-else-if="auth && !formCompleted">
              <v-btn medium outline color="primary" class="ma-0 mb-1" block nuxt to="/pasos">Solicitar garantía</v-btn>
            </v-list-tile-content>
            <v-list-tile-content v-else-if="auth && formCompleted">
              <v-btn medium outline color="primary" class="ma-0 mb-1" block @click="getStatus" :disabled="btnStatusDisabled">{{ btnStatus.text }}</v-btn>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile v-if="auth">
            <v-list-tile-content>
              <v-btn medium outline color="primary" class="ma-0 mb-1" block @click="sessionClose">Cerrar cesión</v-btn>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        
      </v-navigation-drawer>
      
      <v-layout row justify-center>
        <v-dialog v-model="dialog" max-width="340">
          <v-card>
            <v-alert :type="statusAlert" :value="true">{{ status }}</v-alert>
            <v-card-title class="headline">El estado de tu solicitud es:</v-card-title>
            <v-card-text>
              <v-chip :color="statusAlert" text-color="white" label><v-icon left>label</v-icon>{{ status }}</v-chip>
            </v-card-text>
            <v-card-text>Te hemos enviado un email a tu dirección de correo electrónico con la información necesaria para continuar con el trámite.</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn :color="statusAlert" flat="flat" @click.native="dialog = false">Cerrar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
      
    </div>
  </header>
</template>

<script>
  import Cookie from 'js-cookie'
  import status from '~/static/status.json'

  export default {
  
    data: () => ({
      direction: 'top',
      drawer: null,
      dialog: false,
      scrollPosition: null,
      transition: 'slide-y-reverse-transition',
      btnStatusDisabled: false,
      btnStatus: {
        text: 'Ver estado de mi garantía'
      }
    }),

    computed: {
      headLess () {
        if (this.$store.state.headLess) {
          return this.$store.state.headLess
        }
      },
      auth () {
        return this.$store.state.auth
      },
      formCompleted () {
        if (this.$store.state.auth) {
          if (this.$store.state.auth.user.status === 'false') {
            return false
          } else {
            return true
          }
        } else {
          return false
        }
      },
      userHasName () {
        if (this.$store.state.auth) {
          if (this.$store.state.auth.user.name) {
            this.name = this.$store.state.auth.user.name
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      }
    },
    methods: {
      updateScroll: function () {
        this.scrollPosition = window.scrollY
      },
      checkBtnStatus: function (status) {
        this.btnStatusDisabled = status
        this.btnStatus.text = status ? 'Consultando...' : 'Ver estado de mi garantía'
      },
      getStatus: function (val) {
        this.checkBtnStatus(true)
        if (this.$store.state.auth.user.status !== 'false') {
          let email = this.$store.state.auth.user.email
          this.$axios.get(process.env.FRONTEND_DOMAIN + '/api/user-by-email/' + email)
            .then((response) => {
              this.checkBtnStatus(false)
              let indexStatus = Number(response.data.user.status)
              this.status = status[indexStatus].name
              this.statusAlert = status[indexStatus].prop
              if (val) { // Si val esta ok quiere decir que viene del evento del boton
                this.dialog = true
              }
            })
        } else {
          this.checkBtnStatus(false)
        }
      },
      sessionClose: function () {
        Cookie.remove('auth')
        // this.$store.commit('setAuth', '')
        // this.$router.push('/login')
        window.location.href = '/login'
      }
    },
    mixins: {
      homeScrollTop: Function
    },
    mounted () {
      window.addEventListener('scroll', this.updateScroll)
    }

  }
</script>

<style lang="scss" scoped>
  @import '~assets/css/vars.scss';
  header {
    position: fixed;
    text-align: center;
    width: 100%;
    height: 100px;

    margin: 0 auto -100px;
    left: 0;
    right: 0;
    z-index: 999;
    transition: all .3s;
    &.scrolled {
      background-color: rgba(0, 0, 0, 0.5);
    }
    @media (max-width: 767px) {
      height: 60px;
    }
    >div {
      max-width: 1024px;
      display: inline-block;
      margin: 0 auto;
      left: 0;
      right: 0;
      width: 100%;
      position: relative;
      top: -20px;
    }
    #mobile-toggle {
      width: 30px;
      height: 40px;
      position: absolute;
      right: 15px;
      .hamburguer {
        width: 30px;
        height: 40px;
        cursor: pointer;
        background-color: transparent;
        z-index: 9;
        position: absolute;
        top: 5px;
        span {
          z-index: 999 !important;
          display: block;
          position: absolute;
          height: 4px;
          width: 100%;
          background: white;
          border-radius: 2px;
          opacity: 1;
          left: 0;
          transform: rotate(0deg);
          transition: .3s ease-in-out;
          &:nth-child(1) {
            top: 0;
          }
          &:nth-child(2) {
            top: 10px;
          }
          &:nth-child(3) {
            top: 20px;
          }
        }
      }
    }


    .logo {
      margin: 10px auto;
      float: left;
      @media (max-width: 767px) {
        margin: 8px auto;
      }
      img {
        max-width: 220px;
        height: auto;
        position: relative;
        @media (max-width: 767px) {
          max-width: 140px;
          top: 3px;
        }
        &:hover {
          cursor: pointer;
        }
      }
    }
    .menu {
      float: right;
      margin-top: 30px;
      cursor: pointer;
      @media (max-width: 767px) {
        margin-top: 15px;
      }
      .icon {
        color: white;
      }
    }


    .list__tile__title {
      height: 24px;
      line-height: 24px;
      position: relative;
      text-align: left;
      font-size: 18px;
      padding-left: 4px;
      font-weight: 600;
      text-align: center;
    }

    .list__tile__action {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: start;
      -ms-flex-pack: start;
      justify-content: flex-start;
      min-width: 20px;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
    }
  }
</style>
