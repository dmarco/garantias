<template>
  <v-layout align-center justify-center pa-1 :class="interface">
    <v-flex xs12 sm10 md9 lg6 xl5>
      <v-card class="pa-3">
        <v-card-title class="d-block headline mt-4 text-xs-center pa-0">Registro de usuario exitoso</v-card-title>
        <v-card-text class="text-xs-center pa-1 mb-4">
          <p>Por favor verifique su registro haciendo click en el enlace del correo electrónico que se le envió a nombre@dominio.com. <strong>Revise también carpeta de correo no deseado.</strong> </p>
        </v-card-text>
      </v-card>
      <v-layout row wrap class="mb-4 mt-4">
        <v-spacer></v-spacer>
        <v-flex xs12 px-3 class="text-xs-center">
          <v-btn outline color="white" nuxt to="/confirmacion-de-registro">Reenviar correo electrónico</v-btn>
        </v-flex>
        <v-flex xs12 px-3 class="text-xs-center mt-2 white--text">
          <small>Si tiene problemas con su dirección de email, por favor contáctenos al 5217-0900.</small>
        </v-flex>
        <v-spacer></v-spacer>
      </v-layout>
    </v-flex>
  </v-layout>
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
