<template>
  <v-layout align-center justify-center pa-1>
    <v-flex xs12 sm10 md9 lg6 xl5>
        <v-card-title class="display-2 mt-4 mb-2 white--text">Gracias!</v-card-title>
        <v-card class="pa-3">
            <v-card-text class="mb-3">
              <h2 class="mb-2" v-if="route.query.collection_status === 'rejected'">El pago fue rechazado!.</h2>
              <h2 class="mb-2" v-if="route.query.collection_status === 'approved'">El pago fue aprobado!.</h2>
              <h2 class="mb-2" v-if="route.query.collection_status === 'in_process'">El pago está pendiente de aprobación.</h2>
              <p class="mb-4">Su número de referencia es el: <strong>{{ route.query.external_reference }}</strong></p>
            </v-card-text>
        </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    async asyncData ({ app, store, params, route }) {
      let page = await app.$axios.get(`wp/v2/pages?slug=login&_embed`)
      store.commit('setPage', page.data[0])
      store.commit('setObjectForSeo', page.data[0])
      store.commit('setRoute', route)
    },
    layout (context) {
      return 'vuetify'
    },
    data: () => ({
    }),
    computed: {
      page () {
        return this.$store.state.page
      },
      headLess () {
        return this.$store.state.headLess
      },
      route () {
        return JSON.parse(this.$store.state.route)
      }
    },
    head () {
      return {
        title: `${this.$store.state.meta.name}`
      }
    },
    methods: {
    },
    watch: {
    }
  }
</script>