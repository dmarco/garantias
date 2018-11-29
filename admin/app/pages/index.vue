<template>
  <v-layout pa-1>
    DASHBOARD
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
    data: () => ({
    }),
    mounted () {
      window.location.href = '/users'
    },
    head () {
      return {
        title: `${this.$store.state.meta.name}`
      }
    }
  
  }
</script>