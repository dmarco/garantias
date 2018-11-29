<template>
  <v-layout align-center justify-center pa-1>
    <v-flex xs12 sm10 md9 lg6 xl5>
      <v-card class="pa-3">
        <v-card-title class="d-block headline mt-4 text-xs-center pa-0">Su información fue recibida exitosamente</v-card-title>
        <v-card-text class="text-xs-center pa-1 mb-4">
          <p>Ud. ha completado todos los campos y hemos recibido toda la información necesaria.<br><strong>Nos comunicaremos con usted para continuar con el proceso.</strong><br><br></p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-layout row wrap class="mb-4 mt-4">
            <v-spacer></v-spacer>
            <v-flex xs12 px-3 class="text-xs-center">
              <v-btn color="primary" outline nuxt to="/">Regresar a la home</v-btn>
            </v-flex>
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
      let page = await app.$axios.get(`wp/v2/pages?slug=infoirmacion-recibida&_embed`)
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
