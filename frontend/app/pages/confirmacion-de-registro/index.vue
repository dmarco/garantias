<template>
  <v-layout align-center justify-center pa-1>
    <v-flex xs12 sm10 md9 lg6 xl5>
      <v-card class="pa-3">
        <v-card-title class="d-block headline mt-4 pa-0 text-xs-center pa-0">Su cuenta ha sido activada correctamente</v-card-title>
        <v-card-text class="text-xs-center pa-1 mb-4">
          <p>Haga click en el siguiente enlace para comenzar el proceso de carga de datos personales. </p>
        </v-card-text>
      </v-card>
      <v-layout row wrap class="mb-4 mt-4">
        <v-spacer></v-spacer>
        <v-flex xs12 px-3 class="text-xs-center">
          <v-btn outline color="white" nuxt to="/pasos">Cargar mis datos</v-btn>
        </v-flex>
        <v-flex xs12 px-3 class="text-xs-center white--text mt-2">
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
      return 'admin'
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
