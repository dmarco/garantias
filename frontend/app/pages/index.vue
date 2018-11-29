<template>
  <div>
    <v-layout align-center pa-2 justify-center class="hero">
      <v-flex xs12 sm10 md9 lg7 xl6>
        <v-card-title class="card__title mb-4 mt-2 pa-0 text-xs-center white--text">Obtenga la garantía inmobiliara que necesita, <span>fácil y rápido.</span></v-card-title>
        <p class="mb-4 text-xs-center white--text">Gestione su garantía inmobiliaria con mínimos requisitos, en menos de 48hs y desde la comodidad de su casa. <strong>Encontrar hogar nunca fué tan facil.</strong></p>
        <v-card-actions>
          <v-layout row wrap class="mb-2  mt-2 text-xs-center">
            <v-flex xs12 px-2 justify-center align-center>
              <v-btn large outline color="white" nuxt to="/login">Iniciar Sesión</v-btn>
              <v-btn large depressed color="white" nuxt to="/registro">Registrarme</v-btn>
            </v-flex>
          </v-layout>
        </v-card-actions>
      </v-flex>
    </v-layout>
    <div class="card-list xs12">
      <div class="wrapper">
        <div class="display-1 text-xs-center mt-3 mb-3">¿Porqué elegirnos?</div>
        <div class="card text-xs-center">
          <v-icon large mb-2>timer</v-icon>
          <h3>Garantía en 48hs</h3>
          <p>Nuestro servicio le permite contar con una aprobación de garantía en menos de 48hs.</p>
        </div>
        <div class="card text-xs-center">
          <v-icon large mb-2>attach_file</v-icon>
          <h3>Gestione su documentación</h3>
          <p>A través de nuestra plataforma va a poder gestionar y actualizar toda su documentación.</p>
        </div>
        <div class="card text-xs-center">
          <v-icon large mb-2>share</v-icon>
          <h3>Comparta su garantía</h3>
          <p>Comparta el estado de su trámite con las inmobiliarias para hacer mas fácil la gestión del alquiler.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    async asyncData ({ app, store, params }) {
      let page = await app.$axios.get(`wp/v2/pages?slug=index&_embed`)
      store.commit('setPage', page.data[0])
      store.commit('setObjectForSeo', page.data[0])
    },
    layout (context) {
      return 'vuetify'
    },
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
    }
  }
</script>




<style lang="scss" scoped>
  @import '~assets/css/vars.scss';
  @import '~assets/css/global.scss';
  .hero {
    height: 550px;
  }

  .card__title {
    line-height: 4rem !important;
    font-size: 3.6rem;
    font-weight: 400;
    display: block;
    @media (max-width: 767px) {
      font-size: 1.8rem;
      line-height: 2.2rem !important;
    }
    span {
      font-weight: 800;
    }
  }

  .card-list {
    width: 100%;
    background: #fafafa;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: stretch;
    align-content: stretch;
    padding-top: 40px;
    padding-bottom: 40px;
    .wrapper {
      max-width: 1024px;
      margin: 0 auto;
      height: 100%;
    }
  }

  .card {
    width: calc(33.33% - 30px);
    float: left;
    padding: 15px;
    box-shadow: none;
    border: 1px solid $secondary;
    height: 100%;
    margin: 15px;
    border-radius: 5px;
    @media (max-width: 990px) {
      width: calc(100% - 30px);
    }
    h3 {
      margin-bottom: 1rem;
    }
    p {
      font-size: 1.1rem;
      margin: 0;
    }
    i {
      margin-bottom: .5rem;
    }
  }

  p {
    max-width: 730px;
    margin: 0 auto;
    font-size: 1.3rem;
  }
</style>

